
import React, { useState } from 'react';
import { User, TermRecord } from '../types';
import SpecialKeyboard from '../components/SpecialKeyboard';
import { askCulturalContext, generateTermImage } from '../services/geminiService';

interface Props {
  user: User;
  terms: TermRecord[];
  setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
  onLogout?: () => void;
}

const ContributorSpace: React.FC<Props> = ({ user, terms, setTerms, onLogout }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [formData, setFormData] = useState({
    termeFr: '', 
    termeNgiem: '', 
    termeEn: '',
    domaine: 'Biosécurité',
    sousDomaine: '',
    definition: '',
    contexte: '',
    synonymes: '',
    phonetique: '',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400'
  });

  const checkSemantic = async () => {
    if (!formData.termeNgiem) return;
    setLoadingAi(true);
    try {
      const result = await askCulturalContext(`Vérification sémantique : Est-ce que le terme Ngiembɔɔn "${formData.termeNgiem}" est approprié pour désigner "${formData.termeFr}" dans un contexte vétérinaire ?`);
      alert(result);
    } catch (e) {
      alert("L'Oracle est temporairement indisponible.");
    }
    setLoadingAi(false);
  };

  const handleGenImage = async () => {
    if (!formData.termeFr) return;
    setLoadingImg(true);
    const url = await generateTermImage(formData.termeFr);
    if (url) {
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
    setLoadingImg(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termeFr || !formData.termeNgiem || !formData.definition) {
      alert("Veuillez remplir les champs sacrés (Français, Ngiembɔɔn et Définition).");
      return;
    }

    // Fixed: Correctly mapping formData fields to the specific TermRecord properties (Fr vs Ngiem)
    const newTerm: TermRecord = {
      id: Date.now().toString(),
      termeFr: formData.termeFr,
      termeNgiem: formData.termeNgiem,
      domaineFr: formData.domaine,
      domaineNgiem: '', // Initialize empty strings for fields not currently captured in the simplified form
      sousDomaineFr: formData.sousDomaine,
      sousDomaineNgiem: '',
      definitionFr: formData.definition,
      definitionNgiem: '',
      sourceFr: `Contribution de ${user.name}`,
      sourceNgiem: '',
      synonymesFr: formData.synonymes,
      synonymesNgiem: '',
      contexteFr: formData.contexte,
      contexteNgiem: '',
      idFiche: `BOON-CREA-${user.name.substring(0,3).toUpperCase()}-${terms.length + 1}`,
      imageUrl: formData.imageUrl,
      auteur: user.name,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'en_attente'
    };

    setTerms(prev => [...prev, newTerm]);
    setFormData({
      termeFr: '', termeNgiem: '', termeEn: '', 
      domaine: 'Biosécurité', sousDomaine: '',
      definition: '', contexte: '', synonymes: '', phonetique: '',
      imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400'
    });
    
    alert("Votre proposition a été envoyée pour modération !");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-32 animate-fade-in px-4">
      
      <div className="lg:col-span-8 space-y-8">
        <header className="bg-white p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] shadow-xl border-l-[16px] border-amber-500 flex justify-between items-center">
           <div className="flex flex-col gap-1">
              <h2 className="text-2xl sm:text-4xl font-black font-trad text-[#2d1b0d]">Studio de l'Auteur</h2>
              <p className="text-[#8b4513] font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px]">Session de : {user.name}</p>
           </div>
           <div className="w-16 h-16 bg-[#fcf6e5] rounded-2xl flex items-center justify-center text-amber-500 text-2xl shadow-inner border border-amber-500/20 shrink-0">
              <i className="fas fa-pen-nib"></i>
           </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] shadow-2xl space-y-10 border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Français <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.termeFr}
                onChange={e => setFormData({...formData, termeFr: e.target.value})}
                className="w-full px-8 py-5 rounded-2xl bg-stone-50 border-4 border-stone-100 focus:border-amber-500 outline-none font-bold text-stone-700 transition-all" 
                placeholder="Ex: Biosécurité" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Ngiembɔɔn <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.termeNgiem}
                onChange={e => setFormData({...formData, termeNgiem: e.target.value})}
                className="w-full px-8 py-5 rounded-2xl bg-[#fcf6e5] border-4 border-amber-500 outline-none font-black text-[#8b4513] shadow-inner" 
                placeholder="Transcription" 
              />
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-3xl border-4 border-dashed border-stone-200">
             <p className="text-[9px] font-bold text-stone-400 uppercase mb-4 text-center tracking-widest">Clavier Spécial Sagesse</p>
             <SpecialKeyboard onCharClick={(c) => setFormData({...formData, termeNgiem: formData.termeNgiem + c})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Anglais</label>
              <input type="text" value={formData.termeEn} onChange={e => setFormData({...formData, termeEn: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-amber-500 outline-none font-medium text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Domaine</label>
              <select value={formData.domaine} onChange={e => setFormData({...formData, domaine: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-amber-500 outline-none font-bold text-sm">
                <option>Biosécurité</option>
                <option>Pathologie</option>
                <option>Communication</option>
                <option>Culture</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Illustration IA</label>
              <button 
                type="button" 
                onClick={handleGenImage}
                disabled={loadingImg || !formData.termeFr}
                className="w-full bg-white border-2 border-amber-500 text-amber-500 py-4 rounded-xl font-black uppercase text-[9px] hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50"
              >
                {loadingImg ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-magic mr-2"></i>}
                Générer Image
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Définition <span className="text-red-500">*</span></label>
              <button type="button" onClick={checkSemantic} className="text-[10px] font-black text-amber-600 hover:text-amber-800 flex items-center gap-2 transition-colors">
                {loadingAi ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-microscope"></i>} Analyser l'Oracle
              </button>
            </div>
            <textarea 
              rows={4} 
              required
              value={formData.definition}
              onChange={e => setFormData({...formData, definition: e.target.value})}
              className="w-full px-8 py-6 rounded-3xl bg-stone-50 border-4 border-stone-100 focus:border-amber-500 outline-none italic text-stone-700" 
              placeholder="Expliquez le terme avec précision technique..." 
            />
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden h-48 border-4 border-stone-100">
             <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Prévisualisation" />
          </div>

          <button type="submit" className="w-full py-8 rounded-[3rem] bg-[#2d1b0d] text-white font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-amber-600 transition-all text-sm sm:text-base">
             Proposer au Conseil des Sages
          </button>
        </form>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="bg-[#2d1b0d] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group border-b-8 border-amber-500">
          <h3 className="text-2xl font-black font-trad text-amber-500 mb-8">Statistiques d'Auteur</h3>
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
               <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Tes contributions</span>
               <span className="text-3xl font-black text-[#fcf6e5]">{terms.filter(t => t.auteur === user.name).length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
               <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">En attente</span>
               <span className="text-3xl font-black text-amber-500">{terms.filter(t => t.statut === 'en_attente' && t.auteur === user.name).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100">
           <h4 className="text-[10px] font-black uppercase text-stone-400 mb-6 tracking-widest">Dernières Activités</h4>
           <div className="space-y-4">
              {terms.filter(t => t.auteur === user.name).slice(-3).reverse().map(t => (
                <div key={t.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                   <div className={`w-3 h-3 rounded-full ${t.statut === 'valide' ? 'bg-green-500' : t.statut === 'rejete' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                   <div>
                     <p className="text-sm font-bold text-[#2d1b0d]">{t.termeFr}</p>
                     <p className="text-[9px] uppercase font-black text-stone-400">{t.statut}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorSpace;

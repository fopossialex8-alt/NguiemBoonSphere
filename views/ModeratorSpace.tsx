
import React, { useState } from 'react';
import { User, TermRecord } from '../types';
import { playCameroonianAudio, askCulturalContext } from '../services/geminiService';

interface Props {
  user: User;
  terms: TermRecord[];
  setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
  onLogout?: () => void;
}

const ModeratorSpace: React.FC<Props> = ({ user, terms, setTerms, onLogout }) => {
  const pendingTerms = terms.filter(t => t.statut === 'en_attente');
  const [selectedTerm, setSelectedTerm] = useState<TermRecord | null>(null);
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [councilDebate, setCouncilDebate] = useState<{role: string, text: string}[] | null>(null);
  const [loadingOracle, setLoadingOracle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<TermRecord>>({});

  const handleAction = (id: string, status: 'valide' | 'rejete') => {
    setTerms(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...editData, statut: status };
      }
      return t;
    }));
    setSelectedTerm(null);
    setOracleResponse(null);
    setCouncilDebate(null);
    setIsEditing(false);
    alert(`Le décret royal a été appliqué : Terme ${status === 'valide' ? 'validé' : 'rejeté'}.`);
  };

  const listenToTerm = async (term: TermRecord) => {
    await playCameroonianAudio(editData.termeFr || term.termeFr, editData.termeNgiem || term.termeNgiem);
  };

  const consultOracle = async (term: TermRecord) => {
    setLoadingOracle(true);
    try {
      const prompt = `Analyse ce terme vétérinaire pour le lexique BɔɔnSphere :
      Terme : ${editData.termeFr || term.termeFr} (${editData.termeNgiem || term.termeNgiem})
      Définition : ${editData.definitionFr || term.definitionFr}
      Donne un score de pureté linguistique sur 100 et un conseil rapide.`;
      const result = await askCulturalContext(prompt);
      setOracleResponse(result);
    } catch (e) {
      setOracleResponse("Les esprits du savoir sont silencieux...");
    }
    setLoadingOracle(false);
  };

  const triggerCouncil = async (term: TermRecord) => {
    setLoadingOracle(true);
    try {
      const prompt = `Simule un court débat de 3 phrases entre : 
      1. Un Guérisseur Ancestral (tradition), 
      2. Un Vétérinaire Scientifique (technique),
      3. Un Sage Linguiste (langue).
      Sujet : La validité du terme "${editData.termeNgiem || term.termeNgiem}" pour désigner "${editData.termeFr || term.termeFr}".`;
      const result = await askCulturalContext(prompt);
      
      // Simulation simple de parsing pour l'UI
      const lines = result.split('\n').filter(l => l.trim().length > 0).slice(0, 3);
      const debate = [
        { role: 'Le Guérisseur', text: lines[0] || "Le sang de la terre reconnaît ce nom." },
        { role: 'Le Scientifique', text: lines[1] || "La précision technique est acceptable." },
        { role: 'Le Linguiste', text: lines[2] || "La structure tonale respecte nos ancêtres." }
      ];
      setCouncilDebate(debate);
    } catch (e) {
      alert("Le conseil n'a pas pu se réunir.");
    }
    setLoadingOracle(false);
  };

  const startEditing = () => {
    if (!selectedTerm) return;
    setEditData({
      termeFr: selectedTerm.termeFr,
      termeNgiem: selectedTerm.termeNgiem,
      definitionFr: selectedTerm.definitionFr
    });
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in space-y-12">
      
      <header className="bg-[#2d1b0d] p-12 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl border-b-8 border-amber-600 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <i className="fas fa-landmark text-9xl"></i>
         </div>
         <div className="flex items-center gap-6 z-10">
            <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-[#2d1b0d] text-4xl shadow-xl ring-4 ring-white/10">
               <i className="fas fa-gavel"></i>
            </div>
            <div className="space-y-1">
               <h2 className="text-4xl font-black font-trad text-amber-500 tracking-tighter">Le Tribunal des Sages</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Arbitre : {user.name} (Rang Notable)</p>
            </div>
         </div>
         <div className="flex gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 z-10">
            <div className="text-center px-4">
               <p className="text-3xl font-black text-amber-500">{pendingTerms.length}</p>
               <p className="text-[8px] font-bold uppercase opacity-50 tracking-widest">En attente</p>
            </div>
            <div className="w-px bg-white/10 mx-4"></div>
            <div className="text-center px-4">
               <p className="text-3xl font-black">{terms.filter(t => t.statut === 'valide').length}</p>
               <p className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Codifiés</p>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Liste des propositions avec badges */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
            <i className="fas fa-scroll text-amber-500"></i> Parchemins à sceller
          </h3>
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {pendingTerms.length > 0 ? (
              pendingTerms.map(t => (
                <button 
                  key={t.id}
                  onClick={() => { setSelectedTerm(t); setOracleResponse(null); setCouncilDebate(null); setIsEditing(false); }}
                  className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
                    selectedTerm?.id === t.id ? 'bg-[#1a0f08] border-amber-500 shadow-xl translate-x-2' : 'bg-white border-stone-100 hover:border-amber-200'
                  }`}
                >
                  <div className="relative z-10">
                    <h4 className={`text-xl font-black font-trad ${selectedTerm?.id === t.id ? 'text-white' : 'text-stone-800'}`}>{t.termeFr}</h4>
                    <p className={`text-xs font-bold italic ${selectedTerm?.id === t.id ? 'text-amber-500' : 'text-amber-600'}`}>{t.termeNgiem}</p>
                    <div className="flex items-center gap-2 mt-3">
                       <span className="bg-stone-100 text-[8px] px-2 py-0.5 rounded text-stone-500 font-black uppercase">{t.domaineFr}</span>
                       <span className="text-[8px] font-black text-stone-400 uppercase">Par {t.auteur}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedTerm?.id === t.id ? 'bg-amber-500 text-[#1a0f08]' : 'bg-stone-50 text-stone-300'}`}>
                     <i className="fas fa-feather"></i>
                  </div>
                </button>
              ))
            ) : (
              <div className="bg-stone-50 p-12 rounded-[3rem] border-4 border-dashed border-stone-200 text-center opacity-60">
                 <i className="fas fa-peace text-4xl mb-4 text-stone-300"></i>
                 <p className="text-sm font-bold uppercase tracking-widest">Paix dans le sanctuaire.</p>
              </div>
            )}
          </div>
        </div>

        {/* Panneau de revue Dynamique */}
        <div className="lg:col-span-8">
           {selectedTerm ? (
             <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-stone-100 animate-slide-up sticky top-10">
                
                {/* Visualisation & Quick Action Bar */}
                <div className="bg-stone-50 p-6 border-b flex justify-between items-center">
                   <div className="flex gap-3">
                      <button onClick={startEditing} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isEditing ? 'bg-amber-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}>
                        <i className="fas fa-pen-to-square mr-2"></i> Correction Express
                      </button>
                      <button onClick={() => triggerCouncil(selectedTerm)} className="bg-white border border-stone-200 text-stone-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-stone-100 transition-all">
                        <i className="fas fa-users-viewfinder mr-2"></i> Conseil des Anciens
                      </button>
                   </div>
                   <button onClick={() => listenToTerm(selectedTerm)} className="w-12 h-12 bg-[#1a0f08] text-amber-500 rounded-xl shadow-lg hover:scale-110 transition-all flex items-center justify-center">
                      <i className="fas fa-volume-high"></i>
                   </button>
                </div>

                <div className="p-12 space-y-10">
                   {/* Mode Édition / Vue */}
                   <div className="space-y-6">
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-6 bg-amber-50 p-8 rounded-[3rem] border-2 border-amber-100">
                           <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-amber-700 ml-4">Terme Français</label>
                             <input 
                               value={editData.termeFr} 
                               onChange={e => setEditData({...editData, termeFr: e.target.value})}
                               className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 outline-none font-bold text-stone-700"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-amber-700 ml-4">Terme Ngiembɔɔn</label>
                             <input 
                               value={editData.termeNgiem} 
                               onChange={e => setEditData({...editData, termeNgiem: e.target.value})}
                               className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 outline-none font-black italic text-amber-800"
                             />
                           </div>
                           <div className="col-span-2 space-y-2">
                             <label className="text-[9px] font-black uppercase text-amber-700 ml-4">Définition</label>
                             <textarea 
                               rows={3}
                               value={editData.definitionFr} 
                               onChange={e => setEditData({...editData, definitionFr: e.target.value})}
                               className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 outline-none italic text-stone-600"
                             />
                           </div>
                        </div>
                      ) : (
                        <div className="border-b pb-8">
                           <h3 className="text-5xl font-black font-trad text-[#2d1b0d] leading-tight">{selectedTerm.termeFr}</h3>
                           <div className="flex items-center gap-4 mt-2">
                              <p className="text-3xl text-amber-600 font-black italic font-trad">{selectedTerm.termeNgiem}</p>
                              <div className="h-1 flex-grow bg-stone-100 rounded-full opacity-30"></div>
                           </div>
                           <p className="text-xl text-stone-500 italic mt-6 font-medium leading-relaxed">"{selectedTerm.definitionFr}"</p>
                        </div>
                      )}
                   </div>

                   {/* Le Conseil des Anciens - Nouveauté interactive */}
                   {councilDebate && (
                     <div className="bg-[#1a0f08] p-10 rounded-[3rem] shadow-inner space-y-8 border-l-[10px] border-amber-500 animate-fade-in">
                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-4">
                          <i className="fas fa-comments"></i> Débat des Experts
                        </h4>
                        <div className="grid gap-6">
                           {councilDebate.map((d, i) => (
                             <div key={i} className="flex gap-6 group">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-amber-500 text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                                   <i className={`fas ${i===0 ? 'fa-leaf' : i===1 ? 'fa-microscope' : 'fa-language'}`}></i>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">{d.role}</p>
                                   <p className="text-white text-sm italic font-medium opacity-90 leading-relaxed">"{d.text}"</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Oracle & Score - Amélioré */}
                   <div className="bg-[#fcf6e5] p-10 rounded-[4rem] border-2 border-amber-200 space-y-8 relative overflow-hidden group">
                      <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                         <i className="fas fa-brain text-[15rem]"></i>
                      </div>
                      <div className="flex justify-between items-center relative z-10">
                         <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-4">
                            <i className="fas fa-sparkles text-xl"></i> Évaluation de l'Oracle
                         </h4>
                         <button 
                          onClick={() => consultOracle(selectedTerm)}
                          disabled={loadingOracle}
                          className="bg-amber-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-[#2d1b0d] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                         >
                            {loadingOracle ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-crystal-ball mr-2"></i>}
                            Consulter
                         </button>
                      </div>
                      {oracleResponse && (
                        <div className="animate-fade-in relative z-10">
                           <div className="bg-white p-8 rounded-[3rem] border border-amber-100 shadow-sm italic text-amber-900 font-medium leading-relaxed">
                              {oracleResponse}
                           </div>
                        </div>
                      )}
                   </div>

                   {/* Actions Finales */}
                   <div className="flex gap-6 pt-6 relative z-10">
                      <button 
                        onClick={() => handleAction(selectedTerm.id, 'rejete')}
                        className="flex-grow py-8 rounded-3xl bg-white border-4 border-red-50 text-red-500 font-black uppercase tracking-widest text-[12px] hover:bg-red-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-4"
                      >
                         <i className="fas fa-ban text-xl"></i> Bannir ce Savoir
                      </button>
                      <button 
                        onClick={() => handleAction(selectedTerm.id, 'valide')}
                        className="flex-grow py-8 rounded-3xl bg-[#1a0f08] text-amber-500 font-black uppercase tracking-widest text-[12px] hover:bg-amber-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4"
                      >
                         <i className="fas fa-check-double text-xl"></i> Graver dans la Roche
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white border-4 border-dashed border-stone-100 rounded-[5rem] text-center p-20 opacity-80 animate-fade-in shadow-inner">
                <div className="w-56 h-56 bg-stone-50 rounded-[4rem] flex items-center justify-center text-9xl text-stone-200 mb-12 shadow-inner border border-stone-100 group">
                   <i className="fas fa-feather-pointed group-hover:-rotate-45 transition-transform duration-700"></i>
                </div>
                <h3 className="text-3xl font-black font-trad text-stone-300 uppercase tracking-widest">En attente de jugement</h3>
                <p className="text-stone-400 font-medium italic max-w-sm mt-4 text-xl">
                  "Sélectionnez un parchemin à gauche pour examiner sa vérité."
                </p>
                <div className="mt-12 flex gap-4">
                   <div className="h-1 w-12 bg-stone-100 rounded-full"></div>
                   <div className="h-1 w-24 bg-amber-200 rounded-full"></div>
                   <div className="h-1 w-12 bg-stone-100 rounded-full"></div>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default ModeratorSpace;

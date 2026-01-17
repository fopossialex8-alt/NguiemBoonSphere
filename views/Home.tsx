
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchLatestSanitaryNews } from '../services/geminiService';
import AutocompleteSearch from '../components/AutocompleteSearch';
import { TermRecord } from '../types';

const Home: React.FC = () => {
  const [news, setNews] = useState<{text: string, sources: any[]} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestSanitaryNews().then(data => {
      setNews(data);
    });
  }, []);

  const handleSelectSuggestion = (term: TermRecord) => {
    navigate(`/lexique?search=${encodeURIComponent(term.termeFr)}`);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-24 relative">
      {/* Alerte Sanitaire */}
      <div className="bg-white border-l-[8px] border-[#8b4513] p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 ring-1 ring-black/5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-[#8b4513] text-white w-10 h-10 rounded-xl flex items-center justify-center animate-pulse shrink-0">
            <i className="fas fa-shield-virus"></i>
          </div>
          <div>
            <h4 className="text-[#8b4513] font-black uppercase text-[10px] tracking-widest">Veille Sanitaire</h4>
            <p className="text-[#1a0f08] font-bold text-sm leading-tight italic">
              {news ? news.text.substring(0, 80) + "..." : "Le village est sous la protection des sages."}
            </p>
          </div>
        </div>
        <Link to="/map" className="bg-[#1a0f08] text-white px-6 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#b08968] transition-all whitespace-nowrap">Localiser</Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[85vh] min-h-[600px] flex items-center justify-center rounded-[3rem] sm:rounded-[4rem] shadow-2xl border-b-[15px] border-[#b08968] bg-stone-300 border border-stone-200">
        
        {/* Fond Image : Porc Majestueux avec Fallback robuste */}
        <div className="absolute inset-0 z-0 rounded-[3rem] sm:rounded-[4rem] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover scale-100"
            alt="Élevage Porcin Ngiembɔɔn"
            loading="eager"
            onError={(e) => {
              // Deuxième tentative avec une autre image de porc si la première échoue
              const target = e.target as HTMLImageElement;
              if (target.src !== "https://images.unsplash.com/photo-1604848698030-c434ba0851fb?q=80&w=2000&auto=format&fit=crop") {
                target.src = "https://images.unsplash.com/photo-1604848698030-c434ba0851fb?q=80&w=2000&auto=format&fit=crop";
              }
            }}
          />
          {/* Overlay dégradé pour assurer que le texte reste lisible par-dessus l'image */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f08] via-transparent to-black/20"></div>
        </div>
        
        {/* Contenu Hero */}
        <div className="relative z-20 text-center px-6 max-w-5xl space-y-12 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-black font-trad text-white leading-none hero-text-shadow tracking-tighter filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
              BɔɔnSphere
            </h1>
            <div className="flex items-center justify-center gap-6">
              <div className="h-1 w-12 sm:w-24 bg-white/60 rounded-full shadow-lg"></div>
              <p className="text-white text-sm sm:text-4xl font-black uppercase tracking-[0.5em] hero-text-shadow filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
                Létsyeen mekúnɔ̀ɔn
              </p>
              <div className="h-1 w-12 sm:w-24 bg-white/60 rounded-full shadow-lg"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-10 relative">
            <p className="text-white text-[14px] font-black uppercase tracking-[0.7em] hero-text-shadow filter drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">Explorer le savoir ancestral...</p>
            
            {/* Recherche avec Z-INDEX critique */}
            <div className="relative z-[500]">
              <AutocompleteSearch 
                placeholder="Chercher un secret sanitaire..." 
                onSelect={handleSelectSuggestion}
                inputClassName="w-full px-10 py-8 rounded-full bg-white text-[#1a0f08] border-4 border-[#b08968] shadow-[0_30px_70px_rgba(0,0,0,0.7)] outline-none text-center font-black text-xl sm:text-2xl focus:ring-[12px] focus:ring-[#b08968]/30 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cartes d'action rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <ActionCard to="/fiches" icon="fa-scroll" title="Fiches" ngiem="Mefʉ_ me tsyeen" desc="Protocole Royal." color="bg-[#b08968] text-white" />
        <ActionCard to="/lexique" icon="fa-feather" title="Le Trésor" ngiem="Mefʉ_" desc="Le Verbe Sacré." color="bg-[#2d1b0d] text-[#b08968]" />
        <ActionCard to="/path" icon="fa-vihara" title="S'Initier" ngiem="Gÿo nti" desc="Temple du Savoir." color="bg-[#8b4513] text-white" />
        <ActionCard to="/about" icon="fa-landmark" title="Gardiens" ngiem="Meguo" desc="L'Équipe Bɔɔn." color="bg-white border-4 border-[#1a0f08] text-[#1a0f08]" />
      </div>

      {/* Oracle Interactif */}
      <div className="bg-white p-12 sm:p-20 rounded-[4rem] shadow-xl border-l-[15px] border-[#b08968] flex flex-col md:flex-row items-center gap-14 group relative ring-1 ring-stone-100 overflow-hidden">
        <div className="absolute -right-20 -top-20 text-[25rem] text-stone-50 opacity-50 pointer-events-none -rotate-12">
          <i className="fas fa-microchip"></i>
        </div>
        
        <div className="w-44 h-44 bg-stone-900 rounded-[3rem] flex items-center justify-center text-8xl text-[#b08968] shadow-2xl border-4 border-[#b08968]/20 flex-shrink-0 transition-transform group-hover:scale-110 relative z-10">
          <i className="fas fa-microphone-lines"></i>
        </div>
        
        <div className="space-y-8 text-center md:text-left flex-grow relative z-10">
          <div>
            <h3 className="text-4xl sm:text-6xl font-black font-trad text-[#1a0f08]">L'Audience de Nshʉ_</h3>
            <p className="text-[#b08968] font-black uppercase text-[12px] tracking-[0.4em] mt-2">Sagesse Artificielle Ngiembɔɔn</p>
          </div>
          <p className="text-stone-500 font-medium italic leading-relaxed max-w-2xl text-xl opacity-90">
            "Posez votre question à l'Oracle pour déverrouiller les secrets de la protection et de la langue."
          </p>
          <button 
            className="bg-[#1a0f08] text-white px-12 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-2xl hover:bg-[#b08968] transition-all flex items-center gap-6 mx-auto md:mx-0 active:scale-95"
          >
            <i className="fas fa-play text-xl"></i> Activer la Voix du Sage
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ to, icon, title, ngiem, desc, color }: any) => (
  <Link to={to} className={`${color} p-10 rounded-[3rem] shadow-lg hover:-translate-y-3 transition-all group flex flex-col items-center text-center gap-6 border-b-8 border-black/10`}>
    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <h4 className="text-2xl font-black font-trad">{title}</h4>
      <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] leading-none mt-1">{ngiem}</p>
      <div className="h-0.5 w-8 bg-current/20 mx-auto my-4"></div>
      <p className="text-[11px] font-bold opacity-80 uppercase leading-tight tracking-tighter">{desc}</p>
    </div>
  </Link>
);

export default Home;

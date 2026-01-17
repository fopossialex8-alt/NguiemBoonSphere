
import React from 'react';
import { INITIAL_TERMS } from '../constants';
import TermCard from '../components/TermCard';

const Fiches: React.FC = () => {
  const scrollToTop = () => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <header className="text-center space-y-6">
        <div className="flex items-center justify-center gap-6">
           <div className="h-px w-16 bg-stone-200"></div>
           <i className="fas fa-shield-cat text-[#b08968] text-3xl opacity-50"></i>
           <div className="h-px w-16 bg-stone-200"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-7xl font-black font-trad text-[#2d1b0d]">Règles de Protection</h2>
          <p className="text-stone-400 font-black uppercase text-[10px] tracking-[0.4em]">Protocole Royal BɔɔnSphere</p>
        </div>
        <p className="text-stone-500 italic font-medium max-w-xl mx-auto text-lg leading-relaxed">
          Explorez les 19 fiches techniques structurées pour une biosécurité sans faille au village.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {INITIAL_TERMS.map((fiche, index) => (
          <TermCard key={fiche.id} term={fiche} index={index} />
        ))}
      </div>
      
      <div className="bg-[#1a0f08] text-white p-12 rounded-[4rem] text-center space-y-6 shadow-2xl border-b-[15px] border-[#b08968]">
        <h3 className="text-3xl font-black font-trad text-[#b08968]">Le Savoir est votre Bouclier</h3>
        <p className="text-stone-400 max-w-2xl mx-auto italic font-medium">
          "Létsyeen mekúnɔ̀ɔn na tsí nshʉ̀a" - La protection de l'élevage commence par le respect rigoureux de ces fiches.
        </p>
        <div className="pt-6">
          <button 
            onClick={scrollToTop}
            className="bg-white text-[#1a0f08] px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#b08968] hover:text-white transition-all shadow-xl"
          >
            Remonter au Sommet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fiches;

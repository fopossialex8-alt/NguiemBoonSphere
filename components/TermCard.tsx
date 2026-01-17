
import React, { useState } from 'react';
import { TermRecord } from '../types';
import { playCameroonianAudio } from '../services/geminiService';

interface TermCardProps {
  term: TermRecord;
  index: number;
}

const TermCard: React.FC<TermCardProps> = ({ term, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    await playCameroonianAudio(term.termeFr, term.termeNgiem);
    setIsPlaying(false);
  };

  const TableRow = ({ label, fr, ngiem }: { label: string, fr: string, ngiem: string }) => (
    <div className="grid grid-cols-12 border-b border-stone-100 last:border-0 card-table-row">
      <div className="col-span-2 p-3 bg-stone-50 flex items-center justify-center border-r border-stone-100">
        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="col-span-5 p-3 border-r border-stone-100">
        <p className="text-[11px] font-bold text-stone-800 leading-tight">{fr || '-'}</p>
      </div>
      <div className="col-span-5 p-3">
        <p className="text-[12px] font-black text-[#8b4513] italic font-trad leading-tight">{ngiem || '-'}</p>
      </div>
    </div>
  );

  return (
    <div 
      className={`bg-white rounded-[2rem] overflow-hidden shadow-xl border-2 border-stone-100 transition-all duration-300 flex flex-col ${isExpanded ? 'col-span-full ring-4 ring-amber-500/10' : 'hover:-translate-y-2'}`}
    >
      {/* Header Fiche */}
      <div 
        className="relative h-48 overflow-hidden bg-stone-100 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img 
          src={term.imageUrl} 
          alt={term.termeFr} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
             const target = e.target as HTMLImageElement;
             target.src = "https://images.unsplash.com/photo-1544333323-c242144ebd53?q=80&w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
        
        {/* Numérotation de la fiche */}
        <div className="absolute top-4 left-4 bg-amber-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-white/20 z-20">
          Fiche {index + 1}
        </div>

        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white shadow-lg border border-white/20">
          TERMINOLOGIQUE
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="text-white">
            <h3 className="text-xl font-black font-trad leading-none uppercase tracking-tighter drop-shadow-md">{term.termeFr}</h3>
            <p className="text-xs font-bold italic opacity-90 text-amber-400 mt-1 drop-shadow-md">{term.termeNgiem}</p>
          </div>
          <button 
            onClick={handlePlay}
            disabled={isPlaying}
            className="w-10 h-10 rounded-xl bg-white text-[#2d1b0d] hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all shadow-xl"
          >
            <i className={`fas ${isPlaying ? 'fa-spinner fa-spin' : 'fa-volume-up'}`}></i>
          </button>
        </div>
      </div>
      
      {/* Tableau FR | NGIEM */}
      <div className="flex flex-col bg-white overflow-x-auto">
        <div className="grid grid-cols-12 bg-[#1a0f08] text-white/50 text-[8px] font-black uppercase tracking-widest border-b border-[#2d1b0d]">
           <div className="col-span-2 p-2 border-r border-white/5">TYPE</div>
           <div className="col-span-5 p-2 border-r border-white/5">FRANÇAIS (FR)</div>
           <div className="col-span-5 p-2">NGIEMBƆƆN (NGIEM)</div>
        </div>

        <TableRow label="VE" fr={term.termeFr} ngiem={term.termeNgiem} />
        <TableRow label="DOM" fr={term.domaineFr} ngiem={term.domaineNgiem} />
        
        {isExpanded ? (
          <div className="animate-fade-in">
            <TableRow label="SS DOM" fr={term.sousDomaineFr} ngiem={term.sousDomaineNgiem} />
            <TableRow label="DF" fr={term.definitionFr} ngiem={term.definitionNgiem} />
            <TableRow label="SR" fr={term.sourceFr} ngiem={term.sourceNgiem} />
            <TableRow label="SYN" fr={term.synonymesFr} ngiem={term.synonymesNgiem} />
            <TableRow label="CTX" fr={term.contexteFr} ngiem={term.contexteNgiem} />
            <div className="grid grid-cols-12 border-b border-stone-100">
              <div className="col-span-2 p-3 bg-stone-50 flex items-center justify-center border-r border-stone-100">
                <span className="text-[9px] font-black text-stone-400 uppercase">ID</span>
              </div>
              <div className="col-span-10 p-3 flex items-center">
                 <p className="text-[10px] font-mono font-black text-stone-500">{term.idFiche}</p>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsExpanded(true)}
            className="p-3 text-[9px] font-black uppercase text-stone-400 hover:text-[#b08968] bg-stone-50/50 transition-colors tracking-widest"
          >
            Afficher la fiche complète <i className="fas fa-chevron-down ml-1"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default TermCard;

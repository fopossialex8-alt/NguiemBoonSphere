
import React, { useState, useMemo } from 'react';
import { TermRecord } from '../types';
import TermCard from '../components/TermCard';

interface Props {
  terms: TermRecord[];
}

const PublicBrowse: React.FC<Props> = ({ terms }) => {
  const [search, setSearch] = useState('');
  const [viewType, setViewType] = useState<'fiches' | 'lexique'>('fiches');
  const [domainFilter, setDomainFilter] = useState('Tous');

  const filteredTerms = useMemo(() => {
    return terms.filter(t => 
      t.statut === 'valide' &&
      (domainFilter === 'Tous' || t.domaineFr === domainFilter) &&
      (t.termeFr.toLowerCase().includes(search.toLowerCase()) || 
       t.termeNgiem.toLowerCase().includes(search.toLowerCase()))
    );
  }, [terms, search, domainFilter]);

  const domains = ['Tous', ...new Set(terms.filter(t => t.statut === 'valide').map(t => t.domaineFr))];

  return (
    <div className="space-y-12 animate-fade-in pb-20 px-4">
      <section className="text-center py-20 px-6 bg-[#1a0f08] text-white rounded-[3rem] shadow-2xl overflow-hidden relative border-b-8 border-[#b08968]">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/african-cane.png')]"></div>
        <div className="relative z-10 space-y-6">
          <span className="inline-block bg-[#8b4513] text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-2 shadow-lg">
            Vigilance PPA Cameroun
          </span>
          <h1 className="text-5xl md:text-8xl font-black font-trad mb-4 leading-tight hero-text-glow">
            BɔɔnSphere <br/> <span className="text-[#b08968]">Lexique Sacré</span>
          </h1>
          <p className="text-stone-400 max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed italic opacity-80">
            Explorer les préceptes de la biosécurité en <span className="text-[#b08968] font-black italic uppercase">Ngiembɔɔn</span>.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <input 
              type="text"
              placeholder="Chercher un mot sacré..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl text-[#1a0f08] shadow-2xl outline-none text-center font-bold text-lg border-4 border-[#b08968]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex bg-white p-2 rounded-2xl shadow-lg border border-stone-100">
            <button onClick={() => setViewType('fiches')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ${viewType === 'fiches' ? 'bg-[#1a0f08] text-white shadow-md' : 'text-stone-400 hover:bg-stone-50'}`}>
              <i className="fas fa-scroll"></i> Les Fiches
            </button>
            <button onClick={() => setViewType('lexique')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ${viewType === 'lexique' ? 'bg-[#b08968] text-white shadow-md' : 'text-stone-400 hover:bg-stone-50'}`}>
              <i className="fas fa-feather"></i> Le Lexique
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase transition-all whitespace-nowrap border-2 ${domainFilter === d ? 'bg-[#1a0f08] text-white border-[#1a0f08]' : 'bg-white text-stone-500 border-stone-100 hover:border-[#b08968]'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTerms.map((term, index) => (
              <TermCard key={term.id} term={term} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-stone-100">
            <i className="fas fa-search text-4xl text-stone-200 mb-4"></i>
            <h3 className="text-xl font-black text-stone-300 uppercase tracking-widest">Désert du Verbe</h3>
            <p className="text-stone-400 italic">Aucune fiche presente pour ce terme</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicBrowse;

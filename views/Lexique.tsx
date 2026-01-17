
import React, { useState, useMemo } from 'react';
import { LEXIQUE_DATA, GLOSSAIRE_DATA } from '../constants';
import { playCameroonianAudio } from '../services/geminiService';

interface LexiqueProps {
  mode?: 'lexique' | 'glossaire';
}

const Lexique: React.FC<LexiqueProps> = ({ mode = 'lexique' }) => {
  const [playingId, setPlayingId] = useState<string | number | null>(null);
  const [search, setSearch] = useState('');

  const handlePlay = async (fr: string, ng: string, id: string | number) => {
    setPlayingId(id);
    await playCameroonianAudio(fr, ng);
    setPlayingId(null);
  };

  const isLexique = mode === 'lexique';

  const filteredData = useMemo(() => {
    const data = isLexique ? LEXIQUE_DATA : GLOSSAIRE_DATA;
    if (!search) return data;
    return data.filter(item => 
      item.fr.toLowerCase().includes(search.toLowerCase()) || 
      item.ng.toLowerCase().includes(search.toLowerCase()) ||
      (item as any).def?.toLowerCase().includes(search.toLowerCase())
    );
  }, [isLexique, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-fade-in px-4">
      <header className="text-center py-20 bg-white rounded-[5rem] shadow-xl border-t-[10px] border-[#b08968]">
        <h2 className="text-4xl sm:text-7xl font-black font-trad text-[#2d1b0d] tracking-tighter">
          {isLexique ? 'Lexique Bilingue' : 'Glossaire Technique'}
        </h2>
        <p className="text-[#b08968] font-black uppercase text-[10px] tracking-[0.5em] mt-4">
          {isLexique ? 'Présentation du lexique français-ngiembɔɔn' : 'Présentation du glossaire bilingue français-ngiembɔɔn'}
        </p>
        
        <div className="mt-12 max-w-xl mx-auto px-6">
           <div className="relative">
              <input 
                type="text"
                placeholder="Chercher un terme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-8 py-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-amber-500 outline-none font-bold text-[#1a0f08] transition-all shadow-inner"
              />
              <i className="fas fa-search absolute right-6 top-1/2 -translate-y-1/2 text-stone-300"></i>
           </div>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
        {filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a0f08] text-white/50 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-6 border-r border-white/5">{isLexique ? 'TERME FRANÇAIS (FR)' : 'FRANÇAIS (FR + DÉF)'}</th>
                  <th className="p-6 border-r border-white/5">NGIEMBƆƆN (NGIEM)</th>
                  <th className="p-6 text-center">AUDIO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {isLexique ? (
                  (filteredData as typeof LEXIQUE_DATA).map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors group">
                      <td className="p-6 font-bold text-[#2d1b0d]">{item.fr}</td>
                      <td className="p-6 font-black italic font-trad text-amber-700 text-lg">{item.ng}</td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handlePlay(item.fr, item.ng, idx)}
                          disabled={playingId === idx}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all mx-auto ${playingId === idx ? 'bg-stone-100 text-stone-300' : 'bg-[#1a0f08] text-white hover:bg-amber-600 shadow-md'}`}
                        >
                          <i className={`fas ${playingId === idx ? 'fa-spinner fa-spin' : 'fa-volume-up'}`}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  (filteredData as typeof GLOSSAIRE_DATA).map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="p-6 space-y-2">
                         <p className="font-bold text-[#2d1b0d] text-lg uppercase leading-none">{item.fr}</p>
                         <p className="text-stone-400 text-sm italic leading-relaxed">{item.def}</p>
                      </td>
                      <td className="p-6 font-black italic font-trad text-amber-800 text-xl">{item.ng}</td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handlePlay(item.fr, item.ng, item.id)}
                          disabled={playingId === item.id}
                          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all mx-auto ${playingId === item.id ? 'bg-stone-100 text-stone-300' : 'bg-[#1a0f08] text-white hover:bg-amber-600 shadow-lg'}`}
                        >
                          <i className={`fas ${playingId === item.id ? 'fa-spinner fa-spin' : 'fa-volume-up'} text-xl`}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200 text-4xl shadow-inner border border-stone-100">
               <i className="fas fa-search"></i>
            </div>
            <p className="text-stone-400 italic text-xl font-medium">Aucune fiche presente pour ce terme</p>
            <button onClick={() => setSearch('')} className="text-[#b08968] font-black uppercase text-[10px] tracking-widest hover:underline">Réinitialiser la recherche</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lexique;

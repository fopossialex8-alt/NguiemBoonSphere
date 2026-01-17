
import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_TERMS } from '../constants';
import { TermRecord } from '../types';

interface AutocompleteSearchProps {
  placeholder: string;
  onSelect: (term: TermRecord) => void;
  className?: string;
  inputClassName?: string;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({ placeholder, onSelect, className, inputClassName }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TermRecord[]>([]);
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) {
      const filtered = INITIAL_TERMS.filter(t => 
        t.termeFr.toLowerCase().includes(val.toLowerCase()) ||
        t.termeNgiem.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShow(true);
    } else {
      setSuggestions([]);
      setShow(false);
    }
  };

  const handleSelect = (term: TermRecord) => {
    setQuery(term.termeFr);
    setShow(false);
    onSelect(term);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className} z-[999]`}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => query.length > 1 && setShow(true)}
        className={inputClassName || "w-full px-8 py-6 rounded-3xl bg-white border-4 border-amber-500 shadow-2xl outline-none transition-all text-stone-900 font-bold"}
      />
      <i className="fas fa-search absolute right-10 top-1/2 -translate-y-1/2 text-amber-600 text-2xl"></i>

      {show && query.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-6 bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-4 border-amber-500 z-[1000] overflow-hidden animate-fade-in ring-[15px] ring-black/10">
          <div className="bg-stone-50 p-4 border-b border-stone-100">
             <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Révélations du Sanctuaire</p>
          </div>
          
          {suggestions.length > 0 ? (
            suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-10 py-7 hover:bg-amber-50 border-b border-stone-100 last:border-0 transition-all flex items-center justify-between group active:bg-amber-100"
              >
                <div>
                  <p className="font-black text-[#1a0f08] text-2xl group-hover:text-amber-800 transition-colors uppercase tracking-tighter">{s.termeFr}</p>
                  <p className="text-sm text-amber-600 font-black italic mt-1">{s.termeNgiem}</p>
                </div>
                <div className="bg-stone-100 text-stone-400 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner group-hover:shadow-lg group-hover:rotate-12">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </button>
            ))
          ) : (
            <div className="px-10 py-12 text-center space-y-4">
              <i className="fas fa-feather-pointed text-4xl text-stone-200 animate-pulse"></i>
              <p className="text-stone-400 italic font-medium">Aucune fiche presente pour ce terme</p>
            </div>
          )}

          <div className="p-4 bg-stone-900 text-center">
             <p className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.3em]">BɔɔnSphere Intelligence</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;

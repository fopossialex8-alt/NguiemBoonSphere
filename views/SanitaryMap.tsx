
import React, { useState, useEffect } from 'react';
import { findNearbyVetServices } from '../services/geminiService';

const SanitaryMap: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{text: string, links: any[]}>({ text: '', links: [] });
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const data = await findNearbyVetServices(location?.lat, location?.lng);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header className="bg-white p-12 rounded-[4rem] shadow-2xl border-b-8 border-[#d4a373] text-center">
        <div className="w-20 h-20 bg-[#2d1b0d] rounded-2xl flex items-center justify-center text-[#d4a373] text-4xl mx-auto mb-6 shadow-xl">
          <i className="fas fa-map-marked-alt"></i>
        </div>
        <h2 className="text-5xl font-bold font-traditional text-[#2d1b0d]">Carte de Biosécurité</h2>
        <p className="text-stone-500 mt-4 italic">Localisez les centres de santé et zones de vigilance en temps réel.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-[#fcf6e5]">
            <h3 className="text-2xl font-bold font-traditional mb-6 flex items-center gap-3">
              <i className="fas fa-search-location text-[#d4a373]"></i>
              Où sont les gardiens de la santé ?
            </h3>
            <p className="text-stone-600 mb-8">
              BoonSphere utilise la puissance de l'IA pour cartographier les ressources vétérinaires autour de vous. 
              {location ? " Votre position est détectée." : " Position non détectée (recherche générale)."}
            </p>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-[#2d1b0d] text-white py-6 rounded-3xl font-bold shadow-2xl hover:bg-[#8b4513] transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-50"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-compass"></i>}
              Interroger la Carte des Anciens
            </button>
          </div>

          {results.text && (
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-l-[15px] border-[#d4a373] animate-slide-up">
              <div className="prose prose-stone lg:prose-xl max-w-none">
                <p className="text-stone-800 leading-relaxed italic text-lg">{results.text}</p>
              </div>
              
              {results.links.length > 0 && (
                <div className="mt-10 pt-10 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Lieux et Sources identifiés</h4>
                  <div className="flex flex-wrap gap-4">
                    {results.links.map((chunk: any, i: number) => (
                      chunk.maps && (
                        <a 
                          key={i} 
                          href={chunk.maps.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-stone-50 border border-stone-200 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-[#fcf6e5] hover:border-[#d4a373] transition-all group"
                        >
                          <i className="fas fa-location-dot text-red-600 group-hover:scale-125 transition-transform"></i>
                          <span className="font-bold text-stone-700">{chunk.maps.title}</span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#2d1b0d] text-[#fcf6e5] p-10 rounded-[3rem] shadow-2xl sticky top-32">
            <h3 className="text-2xl font-bold font-traditional mb-6">Légende du Gardien</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fas fa-biohazard"></i>
                </div>
                <div>
                  <p className="font-bold">Zone de Vigilance</p>
                  <p className="text-xs text-stone-400">Périmètre de 25km autour d'un foyer confirmé.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fas fa-hospital-alt"></i>
                </div>
                <div>
                  <p className="font-bold">Poste de Santé</p>
                  <p className="text-xs text-stone-400">Centres vétérinaires publics et délégués régionaux.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4a373] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fas fa-id-card"></i>
                </div>
                <div>
                  <p className="font-bold">Point de Contrôle</p>
                  <p className="text-xs text-stone-400">Zones de désinfection et contrôle des mouvements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanitaryMap;

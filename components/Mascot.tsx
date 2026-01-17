
import React, { useState, useRef } from 'react';
import { playCameroonianAudio, connectToLiveGuardian } from '../services/geminiService';
import { UserRole } from '../types';

interface MascotProps {
  userRole?: UserRole;
  contextMessage?: string;
}

const Mascot: React.FC<MascotProps> = ({ userRole = UserRole.PUBLIC, contextMessage }) => {
  const [state, setState] = useState<'idle' | 'talking' | 'listening' | 'live'>('idle');
  const [showBubble, setShowBubble] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<{ text: string, isUser: boolean }[]>([]);
  const [isMagical, setIsMagical] = useState(false);
  const liveSessionRef = useRef<any>(null);

  const getGreeting = () => {
    if (contextMessage) return contextMessage;
    const roleName = userRole === UserRole.ADMIN ? "Alex" : userRole === UserRole.CONTRIBUTOR ? "Carol" : "l'Éleveur";
    return `Salutations, noble ${roleName}. Je suis Nshʉ̀. Prêt pour ton étude du jour ?`;
  };

  const handleSpeak = async () => {
    if (state !== 'idle') return;
    
    setIsMagical(true);
    setState('talking');
    setShowBubble(true);
    
    await playCameroonianAudio(getGreeting(), userRole?.toString());
    
    setTimeout(() => {
      setState('idle');
      setIsMagical(false);
      setTimeout(() => setShowBubble(false), 5000);
    }, 10000);
  };

  const toggleLive = async () => {
    if (state === 'live') {
      liveSessionRef.current?.close();
      liveSessionRef.current = null;
      setState('idle');
      setLiveTranscript([]);
      setShowBubble(false);
      return;
    }

    setState('live');
    setShowBubble(true);
    try {
      const session = await connectToLiveGuardian({
        onTranscript: (text, isUser) => {
          setLiveTranscript(prev => [...prev.slice(-2), { text, isUser }]);
        },
        onInterrupted: () => setState('idle'),
        onAudioStateChange: (isTalking) => setState(isTalking ? 'talking' : 'listening')
      });
      liveSessionRef.current = session;
    } catch (e) {
      setState('idle');
      setShowBubble(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end pointer-events-none select-none">
      
      {/* Particules Magiques Dorées */}
      {isMagical && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 bg-amber-400 rounded-full animate-magic-dust"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Bulle de Dialogue Aérée */}
      {(showBubble || state !== 'idle') && (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-amber-600 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(45,27,13,0.4)] mb-6 max-w-[280px] sm:max-w-[340px] animate-fade-in relative transition-all">
          <div className="space-y-4">
            {state === 'live' ? (
              <div className="space-y-3">
                {liveTranscript.map((t, i) => (
                  <p key={i} className={`text-[11px] font-black tracking-tight ${t.isUser ? 'text-stone-400 text-right' : 'text-amber-800'}`}>
                    {t.isUser ? 'Toi: ' : 'Sage: '}{t.text}
                  </p>
                ))}
                {liveTranscript.length === 0 && <p className="text-[10px] animate-pulse text-amber-500 font-bold">L'Oracle vous écoute...</p>}
              </div>
            ) : (
              <div className="space-y-3">
                 <p className="text-[14px] sm:text-[16px] font-black font-trad text-[#2d1b0d] leading-relaxed">
                    {getGreeting()}
                 </p>
                 <div className="h-1 w-10 bg-amber-500 rounded-full"></div>
                 <span className="text-[7px] text-amber-600 font-black uppercase tracking-[0.3em]">Oracle Nshʉ̀ • Guide Intelligent</span>
              </div>
            )}
            
            <button 
              onClick={toggleLive} 
              className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-lg pointer-events-auto hover:scale-105 active:scale-95 ${state === 'live' ? 'bg-red-700 text-white' : 'bg-[#2d1b0d] text-white'}`}
            >
              {state === 'live' ? 'Quitter le cercle' : 'Conversation Sacrée Live'}
            </button>
          </div>
          <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-b-2 border-r-2 border-amber-600 transform rotate-45"></div>
        </div>
      )}

      {/* Mascotte Svg */}
      <div 
        onClick={handleSpeak}
        className={`pointer-events-auto cursor-pointer transition-all duration-700 p-2 rounded-full ${state !== 'idle' ? 'scale-110' : 'hover:scale-110 active:scale-90'}`}
      >
        <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl">
          <g className={state === 'talking' ? 'animate-talk' : state === 'listening' ? 'animate-listen' : 'animate-head-bob'}>
            <path d="M 60 130 Q 100 110 140 130 L 150 180 Q 100 195 50 180 Z" fill="#2d1b0d" stroke="#d4a373" strokeWidth="2" />
            <circle cx="100" cy="95" r="45" fill="#fbcfe8" stroke="#be185d" strokeWidth="3" />
            <path d="M 55 80 Q 100 20 145 80" fill="#2d1b0d" stroke="#d4a373" strokeWidth="4" />
            <circle cx="100" cy="40" r="6" fill="#fbbf24" className="animate-pulse" />
            <g className="animate-blink">
              <circle cx="82" cy="90" r="4" fill="#1c1917" />
              <circle cx="118" cy="90" r="4" fill="#1c1917" />
            </g>
            <ellipse cx="100" cy="115" rx="14" ry="9" fill="#f9a8d4" stroke="#be185d" strokeWidth="2" />
            <path d="M 90 142 Q 100 152 110 142" fill="none" stroke="#be185d" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes magic-dust {
          0% { transform: scale(0) translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1.5) translateY(-50px); opacity: 0; }
        }
        .animate-magic-dust { animation: magic-dust 1.5s ease-out infinite; }
        @keyframes head-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-head-bob { animation: head-bob 4s ease-in-out infinite; }
        @keyframes talk { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.05); } }
        .animate-talk { animation: talk 0.2s ease-in-out infinite; transform-origin: center bottom; }
        @keyframes listen { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-listen { animation: listen 1s ease-in-out infinite; }
        @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        .animate-blink { animation: blink 4s infinite; }
      `}</style>
    </div>
  );
};

export default Mascot;

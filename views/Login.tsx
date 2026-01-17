
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const PORTALS = [
    { role: UserRole.CONTRIBUTOR, label: "CONTRIBUTEUR", icon: "fa-feather-pointed", desc: "Studio de Création.", color: "bg-amber-500" },
    { role: UserRole.MODERATOR, label: "MODÉRATEUR", icon: "fa-gavel", desc: "Le Conseil des Sages.", color: "bg-stone-800" },
    { role: UserRole.ADMIN, label: "ADMIN", icon: "fa-lock", desc: "Supervision Totale.", color: "bg-red-700" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // 1. Admin
      if (email === 'fopossialex8@gmail.com' && password === 'Alex0257@') {
        const user: User = { 
          id: 'adm-01', name: 'Alex Fopossi', email, role: UserRole.ADMIN, 
          isQualified: true, score: 1000, cauris: 500, level: 10, completedStages: [] 
        };
        onLogin(user);
        navigate('/admin');
        return;
      }
      // 2. Contributor
      if (email === 'douanlacarol3@gmail.com' && password === 'Ema') {
        const user: User = { 
          id: 'staff-01', name: 'Carol Douanla', email, role: UserRole.CONTRIBUTOR, 
          isQualified: true, score: 500, cauris: 250, level: 5, completedStages: [] 
        };
        onLogin(user);
        navigate('/contributor');
        return;
      }
      // 3. Moderator
      if (email === 'mod@boonsphere.com' && password === 'Mod2025!') {
        const user: User = { 
          id: 'mod-01', name: 'Modérateur Royal', email, role: UserRole.MODERATOR, 
          isQualified: true, score: 800, cauris: 400, level: 8, completedStages: [] 
        };
        onLogin(user);
        navigate('/moderate');
        return;
      }
      
      setError("Les accès sont incorrects ou ne correspondent pas au rôle choisi.");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1a0f08] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border-b-[20px] border-amber-600">
        
        {/* Choix du Rôle */}
        <div className="lg:w-1/2 p-10 sm:p-16 bg-stone-50 border-r border-stone-100 flex flex-col justify-center">
          <h2 className="text-3xl font-black font-trad text-[#2d1b0d] mb-10 text-center lg:text-left uppercase">Votre Portail</h2>
          <div className="grid gap-6">
            {PORTALS.map((p) => (
              <button 
                key={p.role}
                onClick={() => setSelectedRole(p.role)}
                className={`flex items-center gap-6 p-6 rounded-3xl border-4 transition-all text-left ${selectedRole === p.role ? 'border-amber-500 bg-white shadow-xl scale-105' : 'border-transparent bg-stone-200/50 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'}`}
              >
                <div className={`${p.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                  <i className={`fas ${p.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-sm tracking-widest">{p.label}</h4>
                  <p className="text-[10px] text-stone-500 font-medium uppercase tracking-tighter">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:w-1/2 p-10 sm:p-16 flex flex-col justify-center relative">
          {selectedRole ? (
            <form onSubmit={handleLogin} className="space-y-8 animate-fade-in">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-black font-trad text-[#2d1b0d]">Authentification</h3>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Gardez vos secrets en sécurité</p>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full px-8 py-5 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-amber-500 outline-none font-bold text-stone-700 transition-all" 
                    placeholder="votre@email.com" 
                  />
                  <i className="fas fa-at absolute right-6 top-1/2 -translate-y-1/2 text-stone-300"></i>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full px-8 py-5 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-amber-500 outline-none font-bold text-stone-700 transition-all pr-16" 
                    placeholder="Mot de passe" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {error && <p className="text-red-600 text-[10px] font-black uppercase text-center bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 rounded-full bg-[#1a0f08] text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-4"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Entrer dans le Sanctuaire"}
              </button>
              
              <button type="button" onClick={() => setSelectedRole(null)} className="w-full text-stone-400 text-[9px] font-black uppercase hover:text-amber-500 tracking-widest">
                <i className="fas fa-arrow-left mr-2"></i> Changer de Portail
              </button>
            </form>
          ) : (
            <div className="text-center space-y-8">
              <div className="w-40 h-40 bg-stone-50 rounded-full mx-auto flex items-center justify-center text-stone-200 text-7xl">
                <i className="fas fa-fingerprint"></i>
              </div>
              <p className="text-stone-400 font-black uppercase tracking-[0.3em] text-[10px] italic max-w-[200px] mx-auto leading-relaxed">
                Identifiez votre rôle ancestral pour accéder à vos privilèges.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

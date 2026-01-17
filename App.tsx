
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { UserRole, User } from './types';
import { INITIAL_TERMS } from './constants';

// Views
import Home from './views/Home';
import Fiches from './views/Fiches';
import Lexique from './views/Lexique';
import LearningPath from './views/LearningPath';
import ContributorSpace from './views/ContributorSpace';
import ModeratorSpace from './views/ModeratorSpace';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import SanitaryMap from './views/SanitaryMap';
import About from './views/About';

const NavItem = ({ to, icon, label, desktop = false, onClick = () => {} }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
        isActive 
          ? 'bg-amber-500 text-[#1a0f08] shadow-lg scale-[1.02]' 
          : 'text-stone-400 hover:bg-stone-800 hover:text-white'
      }`}
    >
      <i className={`fas ${icon} text-lg ${isActive ? 'text-[#1a0f08]' : 'text-amber-500/50 group-hover:text-amber-500'}`}></i>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${desktop ? '' : 'text-xs'}`}>
        {label}
      </span>
    </Link>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [terms, setTerms] = useState(INITIAL_TERMS);

  const handleLogout = () => {
    setCurrentUser(null);
    setSidebarOpen(false);
  };
  
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isMod = currentUser?.role === UserRole.MODERATOR;
  const isContrib = currentUser?.role === UserRole.CONTRIBUTOR;

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col lg:flex-row bg-[#f9f7f2] overflow-hidden font-outfit">
        
        {/* Mobile Toggle Bar */}
        <header className="lg:hidden bg-[#1a0f08] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-[1000] border-b-2 border-amber-600 shadow-xl">
           <Link to="/" className="flex items-center gap-3">
             <i className="fas fa-shield-cat text-amber-500 text-xl"></i>
             <span className="font-trad font-black text-lg tracking-tighter uppercase">BɔɔnSphere</span>
           </Link>
           <button 
             onClick={() => setSidebarOpen(!isSidebarOpen)}
             className="w-10 h-10 bg-amber-500 text-[#1a0f08] rounded-xl flex items-center justify-center shadow-lg"
           >
             <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
           </button>
        </header>

        {/* Sidebar Structure */}
        <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#1a0f08] border-r-4 border-amber-600 z-[950] transition-transform duration-300 transform shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}>
          <div className="p-8 flex items-center gap-4 border-b border-white/5">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-[#1a0f08] shadow-lg shrink-0">
              <i className="fas fa-shield-cat"></i>
            </div>
            <div>
              <h1 className="text-white font-trad font-black text-xl tracking-tighter">BɔɔnSphere</h1>
              <p className="text-amber-500 text-[6px] font-black uppercase tracking-[0.3em] opacity-70">Le Sanctuaire</p>
            </div>
          </div>

          <nav className="flex-grow p-4 space-y-2 py-8 overflow-y-auto">
            <NavItem to="/" icon="fa-house" label="Accueil" desktop onClick={() => setSidebarOpen(false)} />
            <NavItem to="/fiches" icon="fa-file-shield" label="Les Fiches" desktop onClick={() => setSidebarOpen(false)} />
            <NavItem to="/lexique" icon="fa-book-open" label="Lexique" desktop onClick={() => setSidebarOpen(false)} />
            <NavItem to="/glossaire" icon="fa-spell-check" label="Glossaire" desktop onClick={() => setSidebarOpen(false)} />
            <NavItem to="/path" icon="fa-graduation-cap" label="Apprendre" desktop onClick={() => setSidebarOpen(false)} />
            <NavItem to="/map" icon="fa-map-location-dot" label="Zones Santé" desktop onClick={() => setSidebarOpen(false)} />
            <NavItem to="/about" icon="fa-users" label="À Propos" desktop onClick={() => setSidebarOpen(false)} />
            
            <div className="h-px bg-white/5 my-6 mx-4"></div>
            
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-6 py-2">
                   <p className="text-[7px] text-amber-500/50 uppercase font-black tracking-widest">Espace Privé</p>
                </div>
                {isAdmin && <NavItem to="/admin" icon="fa-crown" label="Admin" desktop onClick={() => setSidebarOpen(false)} />}
                {(isAdmin || isMod) && <NavItem to="/moderate" icon="fa-gavel" label="Le Sage (Mod)" desktop onClick={() => setSidebarOpen(false)} />}
                {(isAdmin || isContrib) && <NavItem to="/contributor" icon="fa-pen-nib" label="L'Auteur (Contrib)" desktop onClick={() => setSidebarOpen(false)} />}
                
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all mt-4"
                >
                  <i className="fas fa-power-off text-lg"></i>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="p-4">
                 <Link 
                   to="/login" 
                   onClick={() => setSidebarOpen(false)}
                   className="flex items-center justify-center gap-3 bg-amber-500 text-[#1a0f08] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-white transition-all w-full"
                 >
                    <i className="fas fa-key"></i>
                    S'identifier
                 </Link>
              </div>
            )}
          </nav>

          <div className="p-6 border-t border-white/5 bg-black/20">
             <p className="text-[7px] text-stone-500 font-bold uppercase tracking-widest leading-relaxed">
               © 2025 BɔɔnSphere<br/>Patrimoine Ngiembɔɔn
             </p>
          </div>
        </aside>

        {/* Main Content Area - ID added for scroll control */}
        <div id="main-scroll-container" className="flex-grow flex flex-col h-screen overflow-y-auto relative bg-[#f9f7f2]">
          <main className="flex-grow p-4 sm:p-10 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fiches" element={<Fiches />} />
              <Route path="/map" element={<SanitaryMap />} />
              <Route path="/lexique" element={<Lexique mode="lexique" />} />
              <Route path="/glossaire" element={<Lexique mode="glossaire" />} />
              <Route path="/path" element={<LearningPath />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login onLogin={(u) => setCurrentUser(u)} />} />
              
              <Route path="/admin" element={ isAdmin ? <AdminDashboard terms={terms} onLogout={handleLogout} /> : <Navigate to="/login" /> } />
              <Route path="/moderate" element={ currentUser && (isAdmin || isMod) ? <ModeratorSpace user={currentUser} terms={terms} setTerms={setTerms} onLogout={handleLogout} /> : <Navigate to="/login" /> } />
              <Route path="/contributor" element={ currentUser && (isAdmin || isContrib) ? <ContributorSpace user={currentUser} terms={terms} setTerms={setTerms} onLogout={handleLogout} /> : <Navigate to="/login" /> } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <footer className="bg-[#1a0f08] text-stone-400 py-12 px-10 border-t-8 border-amber-600 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <i className="fas fa-shield-cat text-amber-500 text-2xl"></i>
                     <span className="font-trad text-white text-xl font-black uppercase">BɔɔnSphere</span>
                  </div>
                  <p className="text-sm opacity-60 leading-relaxed italic">
                    "Létsyeen mekúnɔ̀ɔn na tsí nshʉ̀a" - La protection de l'élevage commence par le savoir royal.
                  </p>
               </div>
               <div className="space-y-4">
                  <h4 className="text-white text-xs font-black uppercase tracking-widest">Liens Sacrés</h4>
                  <ul className="text-[10px] space-y-2 uppercase font-bold tracking-widest">
                     <li><Link to="/lexique" className="hover:text-amber-500 transition-colors">Lexique Bilingue</Link></li>
                     <li><Link to="/glossaire" className="hover:text-amber-500 transition-colors">Glossaire Technique</Link></li>
                     <li><Link to="/fiches" className="hover:text-amber-500 transition-colors">Fiches Techniques</Link></li>
                     <li><Link to="/path" className="hover:text-amber-500 transition-colors">Système de Quête</Link></li>
                  </ul>
               </div>
               <div className="space-y-4 text-right">
                  <h4 className="text-white text-xs font-black uppercase tracking-widest">Contact Villageois</h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Cameroun • Région de l'Ouest</p>
                  <div className="flex justify-end gap-4 text-amber-500">
                     <i className="fab fa-facebook hover:text-white transition-colors cursor-pointer"></i>
                     <i className="fab fa-whatsapp hover:text-white transition-colors cursor-pointer"></i>
                     <i className="fas fa-envelope hover:text-white transition-colors cursor-pointer"></i>
                  </div>
               </div>
            </div>
            <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase font-black tracking-[0.3em]">
               <span>© 2025 BɔɔnSphere • TOUS DROITS RÉSERVÉS</span>
               <span className="text-amber-600">CONSTRUIT POUR LA PROTECTION DU CHEPTEL CAMEROUNAIS</span>
            </div>
          </footer>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;

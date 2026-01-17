
import React from 'react';
import { TermRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface Props {
  terms: TermRecord[];
  onLogout?: () => void;
}

const AdminDashboard: React.FC<Props> = ({ terms, onLogout }) => {
  const stats = [
    { name: 'Base Totale', value: terms.length, icon: 'fa-book-atlas', color: 'bg-stone-800' },
    { name: 'Validées', value: terms.filter(t => t.statut === 'valide').length, icon: 'fa-check-circle', color: 'bg-green-700' },
    { name: 'Attente', value: terms.filter(t => t.statut === 'en_attente').length, icon: 'fa-hourglass-half', color: 'bg-amber-600' },
    { name: 'Rang Expert', value: 'Élite', icon: 'fa-crown', color: 'bg-blue-800' },
  ];

  const domainData = Object.entries(
    terms.reduce((acc: any, t) => {
      // Fix: 'domaine' does not exist on TermRecord, using 'domaineFr' for statistics aggregation.
      acc[t.domaineFr] = (acc[t.domaineFr] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#1a0f08', '#d4a373', '#8b1a1a', '#5a3d2b', '#2d1b0d'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20 px-4">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-10 rounded-[3rem] shadow-xl border-l-[12px] border-ebony">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-ebony rounded-2xl flex items-center justify-center text-ochre text-3xl shadow-xl">
              <i className="fas fa-id-card-clip"></i>
           </div>
           <div>
              <h2 className="text-2xl sm:text-4xl font-black font-trad text-ebony">Console de Haute Surveillance</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-ochre font-black uppercase tracking-widest text-[10px]">Administrateur • Fopossi Alex</p>
                {onLogout && (
                  <button onClick={onLogout} className="text-red-500 font-black uppercase text-[8px] hover:underline">Déconnexion</button>
                )}
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-lg border-b-4 border-ochre flex flex-col items-center text-center group hover:scale-105 transition-all">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl mb-4 ${stat.color} shadow-lg`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <p className="text-stone-400 text-[8px] font-black uppercase tracking-[0.2em]">{stat.name}</p>
            <p className="text-4xl font-black text-ebony font-trad">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl flex flex-col">
          <h3 className="text-xl font-black mb-8 font-trad text-ebony flex items-center gap-3">
             <i className="fas fa-chart-pie text-ochre"></i> Répartition des Domaines
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '1rem', border: 'none', background: '#1a0f08', color: '#fff', fontSize: '10px'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
             {domainData.map((d, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                 <span className="text-[8px] font-black text-stone-500 uppercase">{d.name}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 flex flex-col">
          <h3 className="text-xl font-black mb-8 font-trad text-ebony flex items-center gap-3">
             <i className="fas fa-users-cog text-ochre"></i> Gestion de l'Équipe
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Fopossi Alex', role: 'Architecte Senior', status: 'En ligne', color: 'bg-green-500' },
              { name: 'Carol Douanla', role: 'Experte SIG', status: 'Inactif', color: 'bg-stone-300' }
            ].map((u, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-ochre text-ebony text-lg font-black shadow-inner">
                     {u.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-ebony text-sm">{u.name}</p>
                    <p className="text-[9px] text-ochre font-black uppercase tracking-widest">{u.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${u.color}`}></div>
                   <span className="text-[8px] font-black text-stone-400 uppercase">{u.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-auto pt-10 py-4 text-stone-300 font-black uppercase tracking-widest text-[9px] hover:text-ochre transition-colors">
             <i className="fas fa-plus mr-2"></i> Inviter un expert technique
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

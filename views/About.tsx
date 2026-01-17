
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 animate-slide-up space-y-32 pb-40">
      
      {/* Header Royal Magnifié */}
      <header className="text-center space-y-12">
        <div className="flex items-center justify-center gap-8">
           <div className="h-px flex-grow bg-[#b08968] opacity-40"></div>
           <div className="w-24 h-24 bg-[#1a0f08] rounded-[2rem] flex items-center justify-center text-[#b08968] text-4xl shadow-2xl border-4 border-[#b08968]/20 ring-4 ring-stone-100">
             <i className="fas fa-scroll"></i>
           </div>
           <div className="h-px flex-grow bg-[#b08968] opacity-40"></div>
        </div>
        <div className="space-y-6">
          <h1 className="text-6xl sm:text-[9rem] font-black font-trad text-[#1a0f08] tracking-tighter leading-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]">
            BɔɔnSphere
          </h1>
          <p className="text-[#b08968] font-black uppercase tracking-[0.6em] text-sm sm:text-base">Patrimoine • Science • Protection</p>
        </div>
      </header>

      {/* Les Piliers du Projet */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <AboutInfoCard 
          icon="fa-microscope" 
          title="Rigueur Scientifique" 
          desc="Toutes nos données sont basées sur les protocoles officiels de lutte contre la PPA au Cameroun." 
        />
        <AboutInfoCard 
          icon="fa-language" 
          title="Préservation Linguistique" 
          desc="Nous luttons contre l'érosion culturelle en codifiant le savoir vétérinaire en langue Ngiembɔɔn." 
        />
        <AboutInfoCard 
          icon="fa-shield-heart" 
          title="Économie Rurale" 
          desc="Protéger le cheptel, c'est protéger la sécurité financière des milliers de familles de l'Ouest." 
        />
      </section>

      {/* Profils des Gardiens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Carol Douanla */}
        <div className="bg-white p-16 rounded-[5rem] shadow-2xl border-b-[30px] border-[#b08968] flex flex-col items-center text-center space-y-10 group transition-all hover:-translate-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <i className="fas fa-venus text-[12rem]"></i>
          </div>
          <div className="w-80 h-80 bg-stone-100 rounded-[4rem] overflow-hidden border-[15px] border-[#b08968]/10 shadow-2xl relative group-hover:rotate-3 transition-transform duration-1000">
            <img 
              src="./Carol.png" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Carol Douanla"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Carol+Douanla&background=b08968&color=fff&size=512"; }}
            />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-5xl font-black font-trad text-[#1a0f08] leading-tight">Carol Douanla</h2>
            <p className="text-[#b08968] font-black uppercase tracking-[0.4em] text-[12px]">Porteuse de Projet & Experte SIG</p>
          </div>

          <p className="text-stone-600 text-lg leading-relaxed italic font-medium max-w-md relative z-10">
            Ingénieure spécialisée en Systèmes d'Information Géographique, Carol insuffle à BɔɔnSphere sa rigueur d'analyse et son dévouement à la protection du patrimoine rural camerounais.
          </p>

          <div className="flex gap-6 pt-10 border-t border-stone-50 w-full justify-center relative z-10">
            <SocialBtn icon="fa-envelope" link="mailto:douanlacarol3@gmail.com" />
            <SocialBtn icon="fa-phone" link="tel:+237697362587" />
            <SocialBtn icon="fa-whatsapp" link="https://wa.me/237697362587" />
          </div>
        </div>

        {/* Fopossi Alex */}
        <div className="bg-white p-16 rounded-[5rem] shadow-2xl border-b-[30px] border-[#1a0f08] flex flex-col items-center text-center space-y-10 group transition-all hover:-translate-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-8 opacity-5">
             <i className="fas fa-mars text-[12rem]"></i>
          </div>
          <div className="w-80 h-80 bg-stone-100 rounded-[4rem] overflow-hidden border-[15px] border-[#1a0f08]/5 shadow-2xl relative group-hover:-rotate-3 transition-transform duration-1000">
            <img 
              src="./Alex.png" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Fopossi Alex"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Fopossi+Alex&background=1a0f08&color=fff&size=512"; }}
            />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-5xl font-black font-trad text-[#1a0f08] leading-tight">Fopossi Alex</h2>
            <p className="text-[#b08968] font-black uppercase tracking-[0.4em] text-[12px]">Ingénieur Logiciel & Architecte</p>
          </div>

          <p className="text-stone-600 text-lg leading-relaxed italic font-medium max-w-md relative z-10">
            Développeur senior, Alex maîtrise parfaitement les architectures logicielles complexes. Son expertise garantit une plateforme BɔɔnSphere d'une robustesse inégalée pour servir la communauté.
          </p>

          <div className="flex gap-6 pt-10 border-t border-stone-50 w-full justify-center relative z-10">
            <SocialBtn icon="fa-envelope" link="mailto:fopossi.paul@saintjeaningenieur.org" />
            <SocialBtn icon="fa-phone" link="tel:+237698873891" />
            <SocialBtn icon="fa-whatsapp" link="https://wa.me/237698873891" />
          </div>
        </div>

      </div>

      {/* Manifeste BɔɔnSphere */}
      <section className="bg-[#1a0f08] text-white p-20 sm:p-32 rounded-[6rem] shadow-2xl relative overflow-hidden border-b-[25px] border-[#b08968]">
         <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/african-cane.png')] opacity-10"></div>
         <div className="relative z-10 text-center space-y-12">
            <h3 className="text-4xl sm:text-6xl font-trad text-[#b08968] leading-tight tracking-tight uppercase">Le Manifeste du Sanctuaire</h3>
            <p className="text-stone-300 text-xl sm:text-3xl leading-relaxed italic font-medium max-w-5xl mx-auto">
               "BɔɔnSphere n'est pas un simple outil. C'est le mariage sacré du code et de la terre. C'est la promesse que le savoir technique servira de bouclier ancestral pour la survie de notre cheptel."
            </p>
            <div className="flex justify-center items-center gap-12 text-[#b08968]">
               <div className="h-0.5 w-24 bg-white/20"></div>
               <i className="fas fa-leaf text-5xl animate-pulse"></i>
               <div className="h-0.5 w-24 bg-white/20"></div>
            </div>
         </div>
      </section>

      {/* Contact Direct Section */}
      <section className="bg-white p-12 sm:p-20 rounded-[4rem] shadow-xl border-l-[15px] border-[#b08968] flex flex-col md:flex-row items-center justify-between gap-12 ring-1 ring-black/5">
         <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-black font-trad text-[#1a0f08]">Contacter les Gardiens</h3>
            <p className="text-stone-500 font-medium italic">Une question technique ou un besoin de déploiement ?</p>
         </div>
         <div className="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/237698873891" className="flex items-center gap-4 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all">
               <i className="fab fa-whatsapp text-xl"></i> WhatsApp Alex
            </a>
            <a href="mailto:fopossi.paul@saintjeaningenieur.org" className="flex items-center gap-4 bg-[#1a0f08] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all">
               <i className="fas fa-envelope text-xl"></i> Email Tech
            </a>
         </div>
      </section>

    </div>
  );
};

const SocialBtn = ({ icon, link }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-[#1a0f08] text-[#b08968] rounded-2xl flex items-center justify-center text-xl hover:bg-[#b08968] hover:text-[#1a0f08] transition-all shadow-xl ring-4 ring-stone-100">
    <i className={`fas ${icon}`}></i>
  </a>
);

const AboutInfoCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-12 rounded-[4rem] shadow-xl border-t-8 border-[#b08968] flex flex-col items-center text-center space-y-6 transition-all hover:-translate-y-2 ring-1 ring-black/5">
    <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-[#1a0f08] text-4xl shadow-inner border border-stone-100">
      <i className={`fas ${icon}`}></i>
    </div>
    <h4 className="text-2xl font-black font-trad text-[#1a0f08] tracking-tight">{title}</h4>
    <p className="text-sm text-stone-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default About;


import React, { useState, useEffect } from 'react';
import { playCameroonianAudio } from '../services/geminiService';

interface Stage {
  id: number;
  title: string;
  titleNgiem: string;
  icon: string;
  points: number;
  complexity: 'Basique' | 'Intermédiaire' | 'Notable' | 'Sage';
  modules: {
    title: string;
    content: string;
    audioText: string;
    type: 'sagesse' | 'technique' | 'culture';
  }[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

const STAGES: Stage[] = [
  { 
    id: 1, title: "Cercle du Verbe", titleNgiem: "Létsyeen pasẅɛ̀", icon: "📜", points: 100, complexity: 'Basique',
    modules: [
      { type: 'culture', title: "Voyelles Royales", content: "Les sons ɛ et ɔ sont le souffle de notre langue. Sans eux, l'alerte ne peut être criée correctement.", audioText: "Écoutez les sons ɛ et ɔ. Ils sont la base de notre cri d'alerte." },
      { type: 'sagesse', title: "Le Ton du Danger", content: "Un ton haut (́) prévient d'une menace immédiate. Un ton bas (̀) indique une situation stable.", audioText: "Le ton haut est une flèche, le ton bas est un bouclier." }
    ],
    quiz: { question: "Quel son est propre au Ngiembɔɔn et vital pour l'alerte ?", options: ["La lettre X", "La voyelle ɛ", "La consonne Z"], correct: 1, explanation: "Le son ɛ est fondamental pour exprimer les termes de vigilance." }
  },
  { 
    id: 2, title: "L'Ombre Virale", titleNgiem: "Gwáʼa Mekúnɔ̀ɔn", icon: "🧬", points: 200, complexity: 'Basique',
    modules: [
      { type: 'technique', title: "Signes de Fièvre", content: "Les taches rouges sur la peau et une fatigue soudaine des bêtes sont les marques du virus.", audioText: "Observez la peau des bêtes, elle parle quand le mal arrive." },
      { type: 'technique', title: "Le Silence Mortel", content: "Un porc qui ne mange plus est un porc qui nous avertit d'un péril pour tout le village.", audioText: "Le refus de nourriture est le premier cri du virus." }
    ],
    quiz: { question: "Quel signe clinique est caractéristique de la PPA ?", options: ["Poil brillant", "Taches rouges sur la peau", "Appétit féroce"], correct: 1, explanation: "Les hémorragies cutanées (taches rouges) sont typiques de la peste porcine." }
  },
  { 
    id: 3, title: "Rite du Nettoyage", titleNgiem: "Lepomó ffo", icon: "🛡️", points: 300, complexity: 'Basique',
    modules: [
      { type: 'sagesse', title: "Pédiluve Sacré", content: "Désinfecter ses pieds à l'entrée de la ferme, c'est barrer la route au mal invisible.", audioText: "L'eau et le savon sont vos premiers guerriers contre le virus." },
      { type: 'technique', title: "Vêtements Dédiés", content: "Ne portez jamais les habits du marché à la porcherie. Le virus voyage sur les fibres.", audioText: "Laissez les habits de la ville à la porte du sanctuaire." }
    ],
    quiz: { question: "Pourquoi utiliser un pédiluve à chaque entrée ?", options: ["Pour décorer", "Pour tuer le virus sous les bottes", "Pour se rafraîchir"], correct: 1, explanation: "Le pédiluve rompt la chaîne de transmission par les chaussures." }
  },
  { 
    id: 4, title: "Zonage Royal", titleNgiem: "Letúʼu gwoon", icon: "🗺️", points: 400, complexity: 'Intermédiaire',
    modules: [
      { type: 'technique', title: "Espaces Protégés", content: "Séparez les bêtes des étrangers. Seul le gardien du savoir peut entrer dans le cercle de vie.", audioText: "Tracez une frontière que l'étranger ne doit pas franchir." },
      { type: 'sagesse', title: "Clôtures Ancestrales", content: "Une clôture solide n'est pas une prison, c'est un bouclier contre les animaux sauvages porteurs du mal.", audioText: "Le rempart protège la vie à l'intérieur." }
    ],
    quiz: { question: "Quelle est la meilleure protection périmétrique ?", options: ["Divagation libre", "Clôture fermée", "Rien"], correct: 1, explanation: "La clôture empêche le contact avec les suidés sauvages réservoirs du virus." }
  },
  { 
    id: 5, title: "Le Cri d'Alerte", titleNgiem: "Legÿo tà", icon: "📢", points: 500, complexity: 'Intermédiaire',
    modules: [
      { type: 'culture', title: "Notification Rapide", content: "Un éleveur qui prévient est un éleveur qui sauve le village tout entier.", audioText: "N'attendez pas que le feu brûle tout pour appeler l'eau." },
      { type: 'sagesse', title: "Solidarité Sanitaire", content: "Cacher la maladie est un crime contre les ancêtres et l'avenir des enfants.", audioText: "Le savoir partagé est la seule arme invincible." }
    ],
    quiz: { question: "Que faire en cas de doute sur une bête malade ?", options: ["Cacher", "Avertir les autorités", "Vendre"], correct: 1, explanation: "Alerter permet de circonscrire le foyer avant qu'il ne s'étende." }
  },
  { 
    id: 6, title: "L'Expertise Notable", titleNgiem: "Lezsé meliŋé", icon: "🎖️", points: 600, complexity: 'Notable',
    modules: [
      { type: 'technique', title: "Symptômes Digestifs", content: "Diarrhées et vomissements (Lejǔʼ kékáŋ tsɛ̀ɛ lepfòm) sont des alertes graves.", audioText: "Quand le ventre crie, la vie s'enfuit." },
      { type: 'technique', title: "Symptômes Nerveux", content: "Tremblements et désorientation (lejǔʼ kékáŋ na púɔ menŋaŋ nnɛ́) indiquent la phase terminale.", audioText: "L'esprit de la bête s'égare quand le virus gagne la tête." }
    ],
    quiz: { question: "Que signifie 'lejǔʼ kékáŋ' ?", options: ["Maladie légère", "Manifestation de souffrance", "Joie"], correct: 1, explanation: "C'est le terme générique pour désigner les symptômes de douleur ou dysfonctionnement." }
  },
  { 
    id: 7, title: "Le Feu Purificateur", titleNgiem: "Leláa mekúnɔ̀ɔn", icon: "🔥", points: 700, complexity: 'Notable',
    modules: [
      { type: 'technique', title: "Cuisson Salvatrice", content: "Le virus meurt sous la morsure du feu (30 min minimum). Ne donnez jamais de restes crus.", audioText: "Le feu est le juge final du virus." },
      { type: 'culture', title: "Rites de Décontamination", content: "L'eau bouillante et le savon sont les exorcistes du mal viral dans vos auges.", audioText: "Purifiez vos outils comme on purifie son âme." }
    ],
    quiz: { question: "Comment neutraliser le virus dans les restes alimentaires ?", options: ["Laver à l'eau", "Cuire 30 min", "Mettre au soleil"], correct: 1, explanation: "La chaleur détruit l'enveloppe protéique du virus PPA." }
  },
  { 
    id: 8, title: "La Voix du Notable", titleNgiem: "Shwóŋè lá_", icon: "📻", points: 800, complexity: 'Notable',
    modules: [
      { type: 'culture', title: "Médias Locaux", content: "Utilisez les radios communautaires (Shu_m lɔg ńtsege menkʉ̀) pour diffuser la vérité.", audioText: "La vérité doit voyager plus vite que le mal." },
      { type: 'sagesse', title: "L'Alerte Précoce", content: "Legÿo mé zsé tà guɔ gíne ńzyete zyéte : votre cri de guerre.", audioText: "L'alerte sauve la vie." }
    ],
    quiz: { question: "Que signifie 'Shwóŋè lá_' ?", options: ["La forêt", "La langue locale", "Le marché"], correct: 1, explanation: "La langue locale est le meilleur vecteur pour la sensibilisation rurale." }
  },
  { 
    id: 9, title: "Zonage de Survie", titleNgiem: "Jʉ_ gie guɔ áa wó", icon: "🛖", points: 1000, complexity: 'Sage',
    modules: [
      { type: 'technique', title: "Zone Infectée", content: "Comprendre le périmètre de 5 à 50 km autour d'un foyer confirmé.", audioText: "C'est ici que le mal réside, nul ne doit en sortir sans rite." },
      { type: 'sagesse', title: "Zone de Sécurité", content: "Le périmètre externe (Jʉ_ gie guɔ té wó wɔ́ɔ) où la vie continue sous haute vigilance.", audioText: "La frontière est fine entre la vie et le vide." }
    ],
    quiz: { question: "Quelle zone est dite 'indemne' ?", options: ["Zone infectée", "Zone de sécurité", "Zone tampon"], correct: 1, explanation: "La zone de sécurité est celle où le virus n'est pas encore présent." }
  },
  { 
    id: 10, title: "Maître du Lexique", titleNgiem: "Mebùm nnɛ́", icon: "📖", points: 1200, complexity: 'Sage',
    modules: [
      { type: 'culture', title: "Septicémie Royale", content: "Mbùm nnɛ́ légíɛ ngɔ́ʼ tɛʼ : quand le sang brûle de l'intérieur.", audioText: "Le sang qui bouillonne est le signe du départ." },
      { type: 'sagesse', title: "Biosécurité Totale", content: "Meshÿó lɔg ńtáte guɔ légwoon menɔ̀ɔn : le pilier de BɔɔnSphere.", audioText: "Tout le savoir est résumé dans cette phrase." }
    ],
    quiz: { question: "Comment dit-on 'Biosécurité' en Ngiembɔɔn ?", options: ["Meshÿó lɔg ńtáte guɔ", "Leláa", "Shwóŋè"], correct: 0, explanation: "Cela signifie littéralement : les moyens pour protéger les bêtes de la maladie." }
  },
  { 
    id: 11, title: "L'Oracle de l'Élevage", titleNgiem: "Sẅɛ̀ mekúnɔ̀ɔn", icon: "🧠", points: 1500, complexity: 'Sage',
    modules: [
      { type: 'technique', title: "Génétique et Résilience", content: "Apprenez à identifier les races plus robustes (Mekúnɔ̀ɔn mbʉ̀a) et leur comportement.", audioText: "La force vient de la lignée respectée." },
      { type: 'sagesse', title: "L'Équilibre du Cheptel", content: "Le notable ne possède pas les bêtes, il en est le gardien temporaire pour les ancêtres.", audioText: "Sois humble face à la vie que tu protèges." }
    ],
    quiz: { question: "Qui est le véritable propriétaire des bêtes selon la tradition ?", options: ["L'éleveur", "Le notable", "Les ancêtres (via la terre)"], correct: 2, explanation: "Le respect du sacré renforce l'application des règles techniques." }
  },
  { 
    id: 12, title: "Consécration Suprême", titleNgiem: "Notable de BɔɔnSphere", icon: "👑", points: 2500, complexity: 'Sage',
    modules: [
      { type: 'culture', title: "Transmission Finale", content: "Ton savoir doit maintenant être offert à ceux qui ne savent pas encore.", audioText: "Celui qui garde le secret pour lui laisse le virus gagner." },
      { type: 'sagesse', title: "Le Serment du Gardien", content: "Protéger chaque bête comme son propre enfant. Servir la communauté sans faille.", audioText: "Ton nom sera gravé dans le grand livre de la vie du village." }
    ],
    quiz: { question: "Quel est le but ultime de BɔɔnSphere ?", options: ["Gagner de l'argent", "Protéger le cheptel et la langue", "Faire de l'informatique"], correct: 1, explanation: "Le mariage du code et de la terre pour la survie du patrimoine." }
  }
];

const LearningPath: React.FC = () => {
  const [level, setLevel] = useState(() => Number(localStorage.getItem('boon_level')) || 0);
  const [cauris, setCauris] = useState(() => Number(localStorage.getItem('boon_cauris')) || 0);
  const [view, setView] = useState<'map' | 'lesson' | 'quiz' | 'finish' | 'extras'>('map');
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [extraTab, setExtraTab] = useState<'rituel' | 'symboles' | 'pantheon'>('rituel');

  useEffect(() => {
    localStorage.setItem('boon_level', level.toString());
    localStorage.setItem('boon_cauris', cauris.toString());
  }, [level, cauris]);

  const startStage = (idx: number) => {
    setActiveStage(idx);
    setActiveModuleIdx(0);
    setView('lesson');
    setShowExplanation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextModule = () => {
    if (activeStage === null) return;
    if (activeModuleIdx < STAGES[activeStage].modules.length - 1) {
      setActiveModuleIdx(prev => prev + 1);
    } else {
      setView('quiz');
    }
  };

  const handleQuiz = async () => {
    if (activeStage === null || selectedOpt === null) return;
    if (selectedOpt === STAGES[activeStage].quiz.correct) {
      const reward = STAGES[activeStage].points;
      setCauris(prev => prev + reward);
      setView('finish');
      await playCameroonianAudio(`Félicitations, Notable. Tu as maîtrisé le Cercle ${activeStage + 1}.`, "A-hoo!");
    } else {
      setShowExplanation(true);
      await playCameroonianAudio("Réfléchis encore, ton esprit est troublé par le virus de l'oubli.", "Lété nti.");
    }
  };

  const complete = () => {
    if (activeStage !== null && activeStage === level) {
      setLevel(prev => prev + 1);
    }
    setView('map');
    setActiveStage(null);
    setSelectedOpt(null);
  };

  const progress = Math.min((level / STAGES.length) * 100, 100);
  const userRank = level < 3 ? 'Néophyte' : level < 7 ? 'Gardien' : level < 11 ? 'Notable' : 'Grand Sage';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-12 animate-fade-in min-h-screen pb-40">
      
      {/* Header Temple Amélioré */}
      <header className="bg-white p-10 sm:p-16 rounded-[4rem] shadow-2xl border-t-[12px] border-[#b08968] flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden ring-1 ring-stone-100">
        <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none rotate-12">
           <i className="fas fa-vihara text-[20rem]"></i>
        </div>
        <div className="flex items-center gap-10 z-10">
          <div className="w-28 h-28 bg-[#1a0f08] rounded-[3rem] flex items-center justify-center text-[#b08968] text-6xl shadow-2xl ring-8 ring-stone-50">
             <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <h2 className="text-4xl sm:text-6xl font-black font-trad text-[#1a0f08] tracking-tighter">Temple du Savoir</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="bg-[#b08968] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{userRank}</span>
               <p className="text-stone-400 font-black uppercase text-[10px] tracking-[0.4em]">Chemin de l'Initié</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6 z-10 w-full md:w-auto">
           <div className="flex gap-6 w-full md:w-auto">
              <Stat icon="fa-gem" label="Cauris" value={cauris} color="text-amber-600" />
              <Stat icon="fa-crown" label="Étape" value={`${level}/${STAGES.length}`} color="text-[#1a0f08]" />
           </div>
           <div className="w-full h-5 bg-stone-100 rounded-full overflow-hidden border-2 border-stone-200 shadow-inner mt-2">
              <div className="h-full bg-gradient-to-r from-[#b08968] via-amber-500 to-green-600 transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven.png')] opacity-20"></div>
              </div>
           </div>
        </div>
      </header>

      {/* Barre d'onglets pour les fonctionnalités supplémentaires */}
      <div className="flex justify-center gap-4 border-b border-stone-200 pb-4">
         <button onClick={() => setView('map')} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${view === 'map' ? 'bg-[#1a0f08] text-white' : 'text-stone-400 hover:text-[#b08968]'}`}>Ascension</button>
         <button onClick={() => { setView('extras'); setExtraTab('rituel'); }} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${view === 'extras' && extraTab === 'rituel' ? 'bg-[#1a0f08] text-white' : 'text-stone-400 hover:text-[#b08968]'}`}>Rituel Quotidien</button>
         <button onClick={() => { setView('extras'); setExtraTab('symboles'); }} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${view === 'extras' && extraTab === 'symboles' ? 'bg-[#1a0f08] text-white' : 'text-stone-400 hover:text-[#b08968]'}`}>Symboles Sacrés</button>
         <button onClick={() => { setView('extras'); setExtraTab('pantheon'); }} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${view === 'extras' && extraTab === 'pantheon' ? 'bg-[#1a0f08] text-white' : 'text-stone-400 hover:text-[#b08968]'}`}>Panthéon</button>
      </div>

      {view === 'map' && (
        <div className="space-y-20">
           <div className="text-center space-y-6">
              <h3 className="text-4xl font-black font-trad text-[#2d1b0d] uppercase tracking-[0.3em]">La Grande Ascension</h3>
              <p className="text-stone-500 italic max-w-3xl mx-auto text-xl leading-relaxed">
                "Plus tu t'élèves, plus tes yeux voient loin la menace. Deviens le rempart du village."
              </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {STAGES.map((s, i) => (
                <button 
                  key={s.id}
                  onClick={() => i <= level && startStage(i)}
                  disabled={i > level}
                  className={`group p-10 card-royal flex flex-col items-center gap-8 transition-all relative overflow-hidden border-2 ${
                    i === level ? 'ring-[12px] ring-[#b08968]/20 scale-105 border-amber-500 bg-white' : 
                    i < level ? 'bg-green-50/40 border-green-200 shadow-sm' : 'opacity-30 grayscale pointer-events-none bg-stone-100'
                  }`}
                >
                  <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-xl transition-all group-hover:rotate-12 ${i <= level ? 'bg-[#1a0f08] text-[#b08968]' : 'bg-stone-200 text-stone-400'}`}>
                    {s.icon}
                  </div>
                  <div className="text-center relative z-10">
                    <p className="text-[10px] font-black uppercase text-stone-400 mb-2">Cercle {s.id} • {s.complexity}</p>
                    <h4 className="text-2xl font-black text-[#1a0f08] uppercase tracking-tighter leading-none">{s.title}</h4>
                    <p className="text-[12px] font-bold text-[#b08968] italic mt-3 opacity-80">{s.titleNgiem}</p>
                  </div>
                  
                  {i < level && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white animate-fade-in">
                       <i className="fas fa-check"></i>
                    </div>
                  )}
                  {i === level && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-8 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] animate-bounce shadow-2xl z-20">
                      OUVERT
                    </div>
                  )}
                  <div className="mt-4 pt-6 border-t border-stone-100 w-full flex justify-between items-center relative z-10">
                     <span className="text-[9px] font-black uppercase text-stone-400">Honneur</span>
                     <span className="text-base font-black text-amber-600">+{s.points} <i className="fas fa-gem ml-1"></i></span>
                  </div>
                </button>
              ))}
           </div>
        </div>
      )}

      {view === 'extras' && (
        <div className="animate-fade-in space-y-12">
           {extraTab === 'rituel' && (
             <div className="max-w-4xl mx-auto bg-white p-16 rounded-[4rem] shadow-2xl border-l-[15px] border-[#b08968] text-center space-y-10">
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">
                   <i className="fas fa-sun"></i>
                </div>
                <h3 className="text-4xl font-black font-trad text-[#1a0f08]">Le Rituel du Jour</h3>
                <p className="text-xl text-stone-600 italic leading-relaxed">
                   "Chaque soleil apporte une nouvelle vérité. Es-tu prêt pour ton défi matinal ?"
                </p>
                <div className="bg-stone-50 p-10 rounded-[3rem] border-2 border-stone-100">
                   <p className="text-[10px] font-black uppercase text-stone-400 mb-4">Défi du moment</p>
                   <p className="text-2xl font-bold text-[#1a0f08]">Comment dit-on "Désinfection" en langue royale ?</p>
                   <button onClick={() => playCameroonianAudio("Lepomó ffo tsɛ̀ɛ mekab")} className="mt-6 bg-amber-500 text-[#1a0f08] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all">Vérifier avec l'Oracle</button>
                </div>
             </div>
           )}

           {extraTab === 'symboles' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SymboleCard icon="📜" title="Le Verbe" desc="La transmission orale du savoir." />
                <SymboleCard icon="🧬" title="Le Mal" desc="Le virus invisible et redoutable." />
                <SymboleCard icon="🛡️" title="Le Bouclier" desc="Les mesures de biosécurité." />
                <SymboleCard icon="🔥" title="Le Feu" desc="La purification technique." />
             </div>
           )}

           {extraTab === 'pantheon' && (
             <div className="max-w-5xl mx-auto space-y-10">
                <h3 className="text-3xl font-black font-trad text-center text-[#1a0f08]">Le Panthéon des Sages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <Medaille rank="Bronze" levelReq="3" unlocked={level >= 3} icon="fa-shield" />
                   <Medaille rank="Argent" levelReq="7" unlocked={level >= 7} icon="fa-medal" />
                   <Medaille rank="Or" levelReq="11" unlocked={level >= 11} icon="fa-trophy" />
                </div>
             </div>
           )}
        </div>
      )}

      {/* Reste des vues existantes (lesson, quiz, finish) inchangé ... */}
      {view === 'lesson' && activeStage !== null && (
        <div className="max-w-6xl mx-auto bg-white rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-t-[30px] border-[#1a0f08] overflow-hidden animate-slide-up relative ring-1 ring-stone-200">
           {/* Contenu de la leçon identique à la version précédente */}
           <div className="absolute top-14 right-14 flex items-center gap-4">
              <span className="text-[14px] font-black text-[#b08968] uppercase tracking-[0.6em]">Cercle {activeStage + 1}</span>
              <div className="w-12 h-1.5 bg-[#b08968] rounded-full"></div>
           </div>
           
           <div className="p-14 sm:p-24 space-y-20">
              <div className="flex flex-col sm:flex-row items-center gap-12 border-b pb-14 border-stone-100">
                 <div className="w-40 h-40 bg-stone-50 rounded-[3.5rem] flex items-center justify-center text-8xl shadow-inner border-4 border-stone-100 ring-8 ring-stone-50">
                    {STAGES[activeStage].icon}
                 </div>
                 <div className="text-center sm:text-left space-y-4">
                    <h3 className="text-5xl sm:text-7xl font-black font-trad text-[#1a0f08] tracking-tighter">{STAGES[activeStage].modules[activeModuleIdx].title}</h3>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                       <span className="bg-stone-100 text-stone-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{STAGES[activeStage].modules[activeModuleIdx].type}</span>
                       <p className="text-[#b08968] font-black uppercase text-[14px] tracking-[0.4em]">Module {activeModuleIdx + 1} / {STAGES[activeStage].modules.length}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-[#fdfaf7] p-14 sm:p-24 rounded-[5rem] border-8 border-double border-[#b08968]/20 shadow-inner relative group">
                 <div className="absolute -top-7 left-20 bg-[#1a0f08] text-[#b08968] px-10 py-3 rounded-full border-2 border-[#b08968]/30 text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl">Parole de Sage</div>
                 <p className="text-3xl sm:text-5xl text-stone-800 italic font-medium leading-tight text-center font-trad">
                    "{STAGES[activeStage].modules[activeModuleIdx].content}"
                 </p>
              </div>

              <div className="flex flex-col items-center gap-10">
                 <button 
                   onClick={() => playCameroonianAudio(STAGES[activeStage].modules[activeModuleIdx].audioText)}
                   className="w-40 h-40 bg-[#1a0f08] text-[#b08968] rounded-full flex items-center justify-center text-7xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all ring-[15px] ring-stone-100 animate-pulse"
                 >
                    <i className="fas fa-volume-high"></i>
                 </button>
                 <p className="text-[14px] font-black uppercase text-stone-400 tracking-[0.5em] animate-bounce">Écouter la Sagesse</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-16 gap-10 border-t border-stone-50">
                 <button onClick={() => setView('map')} className="text-stone-300 font-black uppercase text-[12px] tracking-[0.5em] hover:text-red-700 transition-colors">Interrompre l'initiation</button>
                 <button 
                   onClick={nextModule}
                   className="w-full sm:w-auto bg-[#1a0f08] text-white px-24 py-10 rounded-[2.5rem] font-black uppercase text-lg tracking-[0.5em] shadow-2xl hover:bg-[#b08968] transition-all flex items-center justify-center gap-8 group"
                 >
                   {activeModuleIdx < STAGES[activeStage].modules.length - 1 ? 'Approfondir' : 'Le Jugement Final'}
                   <i className="fas fa-arrow-right group-hover:translate-x-4 transition-transform"></i>
                 </button>
              </div>
           </div>
        </div>
      )}

      {view === 'quiz' && activeStage !== null && (
        <div className="max-w-5xl mx-auto bg-white rounded-[6rem] shadow-2xl border-b-[40px] border-[#b08968] p-16 sm:p-28 space-y-20 animate-slide-up relative ring-1 ring-stone-200">
           <div className="text-center space-y-8">
              <div className="w-24 h-2 bg-amber-500 mx-auto rounded-full"></div>
              <span className="text-amber-600 font-black uppercase text-[14px] tracking-[0.8em]">L'Épreuve du Discernement</span>
              <h3 className="text-4xl sm:text-6xl font-black font-trad text-[#1a0f08] leading-tight">
                 {STAGES[activeStage].quiz.question}
              </h3>
           </div>

           <div className="grid grid-cols-1 gap-10">
              {STAGES[activeStage].quiz.options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => { setSelectedOpt(i); setShowExplanation(false); }}
                  className={`p-12 rounded-[3.5rem] border-4 text-left font-black text-2xl transition-all relative overflow-hidden group ${
                    selectedOpt === i ? 'bg-[#1a0f08] border-amber-500 text-white shadow-2xl translate-x-8' : 'bg-stone-50 border-stone-100 text-stone-600 hover:border-amber-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-12 relative z-10">
                    <span className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl transition-all ${selectedOpt === i ? 'bg-amber-500 text-[#1a0f08] rotate-12' : 'bg-white text-stone-300 shadow-inner'}`}>{String.fromCharCode(65 + i)}</span>
                    <span className="flex-grow leading-tight uppercase tracking-tighter">{opt}</span>
                  </div>
                  {selectedOpt === i && <i className="fas fa-certificate absolute -right-10 -top-10 text-white/5 text-[18rem]"></i>}
                </button>
              ))}
           </div>

           {showExplanation && (
             <div className="bg-red-50 p-10 rounded-[3rem] border-4 border-red-100 animate-bounce">
                <p className="text-red-800 font-bold italic text-center text-xl">
                  "{STAGES[activeStage].quiz.explanation}"
                </p>
             </div>
           )}

           <button 
             onClick={handleQuiz}
             disabled={selectedOpt === null}
             className="w-full bg-[#1a0f08] text-white py-12 rounded-[3.5rem] font-black uppercase text-xl tracking-[0.6em] shadow-2xl hover:bg-amber-600 transition-all disabled:opacity-30 flex items-center justify-center gap-8 group active:scale-95"
           >
             Trancher avec Justice
             <i className="fas fa-gavel text-amber-500 group-hover:rotate-45 transition-transform duration-700"></i>
           </button>
        </div>
      )}

      {view === 'finish' && activeStage !== null && (
        <div className="max-w-4xl mx-auto bg-white rounded-[7rem] shadow-2xl p-28 text-center space-y-16 animate-appear border-b-[30px] border-green-600 relative overflow-hidden ring-1 ring-stone-200">
           <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-green-400 to-green-600"></div>
           <div className="w-48 h-48 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-9xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-[20px] ring-green-100">
              <i className="fas fa-check-double"></i>
           </div>
           <div className="space-y-8">
              <h3 className="text-6xl sm:text-8xl font-black font-trad text-[#1a0f08] tracking-tighter leading-none">Cercle Validé !</h3>
              <p className="text-stone-500 font-medium italic text-3xl leading-relaxed max-w-2xl mx-auto">
                 "Ton esprit s'élève. Tu es désormais plus proche de la sagesse suprême de BɔɔnSphere."
              </p>
           </div>
           <div className="bg-amber-50 p-16 rounded-[6rem] border-4 border-amber-200 shadow-inner group transition-all hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[18px] font-black uppercase text-amber-800 tracking-[0.6em] mb-6 relative z-10">Honneur Académique</p>
              <p className="text-9xl font-black text-amber-900 drop-shadow-2xl relative z-10">+{STAGES[activeStage].points} Cauris</p>
           </div>
           <button onClick={complete} className="w-full bg-[#1a0f08] text-white py-12 rounded-[3.5rem] font-black uppercase text-lg tracking-[0.6em] shadow-2xl hover:bg-amber-600 transition-all active:scale-95">
              Poursuivre l'Ascension
           </button>
        </div>
      )}
    </div>
  );
};

const Stat = ({ icon, label, value, color }: any) => (
  <div className="flex-grow flex items-center gap-8 px-12 py-6 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-md transition-all hover:shadow-xl hover:bg-white ring-1 ring-black/5">
     <i className={`fas ${icon} ${color} text-4xl`}></i>
     <div className="text-left">
        <p className="text-[12px] font-black uppercase text-stone-400 tracking-widest">{label}</p>
        <p className={`text-4xl font-black leading-none ${color} mt-2`}>{value}</p>
     </div>
  </div>
);

const SymboleCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-4 border-amber-500 text-center space-y-4 hover:-translate-y-2 transition-all">
     <div className="text-5xl">{icon}</div>
     <h4 className="font-black font-trad text-stone-800">{title}</h4>
     <p className="text-[10px] text-stone-400 font-bold uppercase">{desc}</p>
  </div>
);

const Medaille = ({ rank, levelReq, unlocked, icon }: any) => (
  <div className={`p-8 rounded-[3rem] border-4 flex flex-col items-center gap-4 transition-all ${unlocked ? 'bg-white border-amber-500 shadow-2xl' : 'bg-stone-50 border-stone-200 grayscale opacity-40'}`}>
     <i className={`fas ${icon} text-5xl ${unlocked ? 'text-amber-500 animate-bounce' : 'text-stone-300'}`}></i>
     <h4 className="font-black text-stone-800">{rank}</h4>
     <p className="text-[9px] font-black uppercase text-stone-400">Niveau {levelReq}</p>
  </div>
);

export default LearningPath;

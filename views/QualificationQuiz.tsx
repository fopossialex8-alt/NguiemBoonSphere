
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';

interface Props {
  role: string;
  onComplete: () => void;
}

const QualificationQuiz: React.FC<Props> = ({ role, onComplete }) => {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  const startTest = async () => {
    setLoading(true);
    const data = await generateQuiz(role);
    setQuizData(data);
    setLoading(false);
  };

  const submitTest = () => {
    let score = 0;
    quizData.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctIndex) score++;
    });

    if (score >= 2) {
      setFinished(true);
      onComplete();
    } else {
      alert("L'Oracle estime que tu dois encore étudier les fiches royales. Reviens plus tard.");
      setAnswers({});
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {!quizData ? (
        <div className="text-center bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-[#2d1b0d]">
           <div className="w-24 h-24 bg-[#fcf6e5] text-amber-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 border-4 border-amber-500 shadow-xl">
             <i className="fas fa-user-shield"></i>
           </div>
           <h2 className="text-3xl font-bold font-trad text-[#2d1b0d] mb-4">Examen de Qualification</h2>
           <p className="text-stone-500 mb-10 leading-relaxed italic">
             Le rôle de {role} requiert une connaissance parfaite de la biosécurité Ngiembɔɔn. 
             Es-tu prêt à prouver ton expertise ?
           </p>
           <button 
             onClick={startTest}
             disabled={loading}
             className="bg-[#2d1b0d] text-white px-12 py-5 rounded-full font-bold shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-4 mx-auto uppercase tracking-widest text-sm"
           >
             {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-fire-alt"></i>}
             Lancer l'Examen Sacré
           </button>
        </div>
      ) : finished ? (
        <div className="text-center bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-green-500 animate-fade-in">
           <i className="fas fa-award text-8xl text-green-500 mb-6"></i>
           <h2 className="text-4xl font-bold font-trad text-[#2d1b0d]">Qualifié !</h2>
           <p className="mt-4 text-stone-600 font-medium">Tes réponses ont convaincu le Conseil des Sages.</p>
           <button onClick={() => window.location.reload()} className="mt-10 bg-[#2d1b0d] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">Accéder à mon espace</button>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-t-[15px] border-amber-500 space-y-10">
           <div className="text-center border-b pb-6">
              <h3 className="text-2xl font-black font-trad">Questionnaire Oracle</h3>
           </div>
           {quizData.questions.map((q: any, i: number) => (
             <div key={q.id} className="space-y-6">
               <p className="text-xl font-bold text-[#2d1b0d]">{i+1}. {q.question}</p>
               <div className="grid grid-cols-1 gap-3">
                  {q.options.map((opt: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setAnswers({...answers, [q.id]: idx})}
                      className={`text-left p-5 rounded-2xl border-2 transition-all font-medium ${answers[q.id] === idx ? 'bg-amber-500 border-[#2d1b0d] text-[#2d1b0d] font-bold shadow-lg' : 'bg-stone-50 border-stone-100'}`}
                    >
                      {opt}
                    </button>
                  ))}
               </div>
             </div>
           ))}
           <button 
            onClick={submitTest}
            disabled={Object.keys(answers).length < quizData.questions.length}
            className="w-full bg-[#2d1b0d] text-white py-6 rounded-3xl font-bold shadow-2xl disabled:opacity-50 uppercase tracking-widest text-xs"
           >
             Soumettre le Test
           </button>
        </div>
      )}
    </div>
  );
};

export default QualificationQuiz;

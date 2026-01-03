
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { ProjectNode, IdeaSynthesisResult, SystemLog } from '../types';

interface IdeaLabProps {
  onPublish: (project: ProjectNode) => void;
  addLog: (msg: string, type: SystemLog['type']) => void;
}

const IdeaLab: React.FC<IdeaLabProps> = ({ onPublish, addLog }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdeaSynthesisResult | null>(null);

  const handleSynthesize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    addLog(`بدء عملية التخليق العصبي للفكرة: "${input.substring(0, 20)}..."`, "INFO");
    try {
      const data = await gemini.synthesizeIdea(input);
      setResult(data);
      addLog("اكتمل تخليق الفكرة بنجاح", "SUCCESS");
    } catch (err) {
      addLog("خطأ في الاتصال بالعقل المركزي", "ERROR");
      alert("فشل التخليق.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!result) return;
    const project: ProjectNode = {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title,
      description: result.description,
      roadmap: result.roadmap,
      costPoints: result.costEstimation,
      harmony: result.fishHeartMetric,
      timestamp: new Date().toISOString(),
      status: 'STABLE'
    };
    onPublish(project);
    setResult(null);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-[#bf953f] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
        <div className="relative glass-panel p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">🧪</span>
            مختبر التخليق السيبراني
          </h2>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="أدخل بذور المعرفة هنا... دع العقل المركزي يبنيها."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#bf953f] transition-all h-40 resize-none shadow-inner font-light"
            />
            <div className="absolute bottom-4 left-4 flex gap-3">
               {input.length > 0 && !loading && (
                 <button onClick={() => setInput('')} className="text-[10px] text-gray-500 hover:text-white uppercase font-mono">Clear</button>
               )}
               <button
                onClick={handleSynthesize}
                disabled={loading || !input.trim()}
                className="px-8 py-3 bg-gradient-to-r from-[#bf953f] to-amber-700 hover:scale-105 active:scale-95 text-black font-black rounded-xl transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(191,149,63,0.4)] disabled:opacity-30"
              >
                {loading ? (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '200ms'}} />
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '400ms'}} />
                  </div>
                ) : (
                  <>تخليق الفكرة <span className="text-lg">✨</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="glass-panel p-10 rounded-2xl border border-[#bf953f]/40 relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#bf953f]/10 blur-3xl rounded-full" />
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <div className="text-[10px] text-[#bf953f] font-mono mb-1">PROJECT_IDENTIFIED: {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
              <h3 className="text-3xl font-black gold-gradient leading-tight">{result.title}</h3>
            </div>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
              <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase">Harmony Index</div>
              <div className="text-3xl font-bold text-[#bf953f]">{result.fishHeartMetric}%</div>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-10 border-r-2 border-[#bf953f]/30 pr-6">
            {result.description}
          </p>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#bf953f]" />
                خارطة الطريق التنفيذية
              </h4>
              <div className="space-y-3">
                {result.roadmap.map((step, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-6 h-6 rounded bg-[#bf953f]/10 border border-[#bf953f]/30 flex items-center justify-center text-[10px] font-mono text-[#bf953f] group-hover:bg-[#bf953f] group-hover:text-black transition-colors">
                      {i + 1}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-white transition-colors">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-6">
               <div className="p-6 rounded-2xl bg-[#bf953f]/5 border border-[#bf953f]/10 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Estimated Value</div>
                    <div className="text-2xl font-bold font-mono text-white">{result.costEstimation.toLocaleString()} <span className="text-xs text-[#bf953f]">K-PTS</span></div>
                  </div>
                  <div className="text-3xl">💎</div>
               </div>
               <button
                onClick={handlePublish}
                className="w-full py-4 border border-[#bf953f] text-[#bf953f] hover:bg-[#bf953f] hover:text-black font-bold rounded-xl transition-all uppercase tracking-widest text-sm"
              >
                نشر في الشبكة المعرفية المركزية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaLab;

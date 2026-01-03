
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gemini, decodeAudioData, createPcmBlob, decode } from '../services/geminiService';
import { SystemLog } from '../types';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

interface LiveExperienceProps {
  addLog: (msg: string, type: SystemLog['type']) => void;
}

const LiveExperience: React.FC<LiveExperienceProps> = ({ addLog }) => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const stopAllAudio = useCallback(() => {
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const handleAudioChunk = useCallback(async (base64: string) => {
    if (!audioCtxRef.current) return;
    try {
      const bytes = decode(base64);
      const buffer = await decodeAudioData(bytes, audioCtxRef.current, 24000, 1);
      
      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtxRef.current.currentTime);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration;
      
      sourcesRef.current.add(source);
      source.onended = () => sourcesRef.current.delete(source);
    } catch (e) {
      console.error("Audio Decoding Error:", e);
    }
  }, []);

  const startSession = async () => {
    addLog("محاولة إنشاء اتصال عصبي مع Zephyr...", "INFO");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      sessionPromiseRef.current = gemini.connectLive({
        onAudio: handleAudioChunk,
        onInterrupted: stopAllAudio,
        onTranscription: (text, isUser) => {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.isUser === isUser && (Date.now() - new Date(last.time).getTime()) < 3000) {
              return [...prev.slice(0, -1), { ...last, text: last.text + " " + text }];
            }
            return [...prev, { text, isUser, time: new Date().toISOString() }];
          });
        },
        onClose: () => {
          setIsActive(false);
          addLog("تم قطع الاتصال مع Zephyr", "WARNING");
        }
      });

      const session = await sessionPromiseRef.current;
      
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        sessionPromiseRef.current.then((s: any) => s.sendRealtimeInput({ media: pcmBlob }));
      };
      source.connect(processor);
      processor.connect(inputCtx.destination);
      processorRef.current = processor;

      setIsActive(true);
      addLog("الاتصال العصبي مع Zephyr مستقر", "SUCCESS");
    } catch (err) {
      addLog("فشل إنشاء الاتصال العصبي", "ERROR");
      alert("يرجى تفعيل الميكروفون.");
    }
  };

  const stopSession = () => {
    stopAllAudio();
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    setIsActive(false);
    addLog("تم إغلاق الجلسة يدوياً", "INFO");
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Control Panel */}
      <div className="lg:col-span-4 glass-panel p-8 rounded-3xl flex flex-col items-center justify-between border border-white/5 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${isActive ? 'bg-[#bf953f] shadow-[0_0_10px_#bf953f]' : 'bg-red-900/50'}`} />
        
        <div className="text-center space-y-4">
          <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-1000 relative ${isActive ? 'border-[#bf953f] cyber-glow' : 'border-white/10 opacity-30'}`}>
            {isActive && <div className="absolute inset-0 rounded-full border border-[#bf953f] animate-ping opacity-20" />}
            <span className="text-5xl font-black orbitron gold-gradient">Z</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold orbitron tracking-widest uppercase">Zephyr Mind</h3>
            <p className="text-[10px] font-mono text-gray-500">VOICE RECOGNITION UNIT 01</p>
          </div>
        </div>

        <div className="w-full space-y-4">
           {!isActive ? (
            <button 
              onClick={startSession}
              className="w-full py-5 bg-gradient-to-r from-amber-600 to-[#bf953f] text-black font-black rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(191,149,63,0.3)] flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              🎙️ Open Neural Link
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="w-full py-5 bg-red-900/20 border border-red-500/50 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              🛑 Close Link
            </button>
          )}
          <div className="text-[9px] text-center font-mono text-gray-600">ENCRYPTION: AES-256 | LATENCY: {isActive ? '12ms' : '0ms'}</div>
        </div>

        <div className="w-full h-12 flex items-end justify-center gap-1">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 bg-[#bf953f] transition-all duration-75 ${isActive ? '' : 'h-1 opacity-10'}`}
              style={{ height: isActive ? `${10 + Math.random() * 90}%` : '4px' }}
            />
          ))}
        </div>
      </div>

      {/* Transcription Stream */}
      <div className="lg:col-span-8 glass-panel p-2 rounded-3xl border border-white/5 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 font-mono uppercase">Neural Stream Output</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4">
               <div className="text-4xl opacity-20">📡</div>
               <div className="italic font-light">بانتظار موجاتك الصوتية لبدء التحويل...</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.isUser ? 'items-start' : 'items-end'} animate-in slide-in-from-bottom-2`}>
              <div className="text-[9px] font-mono text-gray-600 mb-1 uppercase tracking-widest">{m.isUser ? 'HUMAN_INPUT' : 'ZEPHYR_RESPONSE'}</div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.isUser 
                ? 'bg-white/5 border border-white/10 rounded-tr-none' 
                : 'bg-[#bf953f]/10 border border-[#bf953f]/30 text-[#bf953f] rounded-tl-none font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default LiveExperience;


import React from 'react';

const RobotsCenter: React.FC = () => {
  const bots = [
    { name: 'SYNTH-7', status: 'ACTIVE', task: 'Idea Synthesis', color: 'bg-[#bf953f]' },
    { name: 'ZEPHYR-V', status: 'IDLE', task: 'Voice Interaction', color: 'bg-blue-500' },
    { name: 'INDEX-ER', status: 'BUSY', task: 'Economy Sync', color: 'bg-green-500' },
    { name: 'HEART-M', status: 'ACTIVE', task: 'Harmony Monitoring', color: 'bg-red-500' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
        {/* Animated Radial Pulse for Algorithm */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-64 h-64 border border-[#bf953f] rounded-full animate-ping" />
          <div className="absolute w-48 h-48 border border-[#bf953f] rounded-full animate-[ping_2s_infinite]" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6 drop-shadow-[0_0_15px_#bf953f]">🐟💖</div>
          <h3 className="text-2xl font-bold gold-gradient orbitron mb-4">Fish Heart Algorithm</h3>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            خوارزمية "قلب السمكة" تقيس مدى النبض المعرفي والتوافق التوافقي للأفكار. عندما يصل "النبض" إلى 90%، تصبح الفكرة ناضجة للاستثمار المطلق.
          </p>
          <div className="mt-8 flex gap-8 justify-center">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-mono mb-1">CURRENT PULSE</div>
              <div className="text-3xl font-bold text-[#bf953f]">84.2</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-mono mb-1">STABILITY</div>
              <div className="text-3xl font-bold text-white">HIGH</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">وحدات المعالجة المستقلة (Bots)</h3>
        {bots.map((bot, i) => (
          <div key={i} className="glass-panel p-5 rounded-xl flex items-center gap-6 border-l-4" style={{ borderColor: bot.status === 'ACTIVE' ? '#bf953f' : '#333' }}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-black/50 border border-white/10`}>
               🤖
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold orbitron text-sm">{bot.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${bot.status === 'ACTIVE' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {bot.status}
                </span>
              </div>
              <div className="text-xs text-gray-500">Task: {bot.task}</div>
            </div>
          </div>
        ))}
        <div className="p-4 bg-[#bf953f]/5 border border-[#bf953f]/20 rounded-xl mt-4">
          <p className="text-[10px] text-gray-400 leading-tight">
            * يتم تشغيل البوتات أوتوماتيكياً عبر بروتوكول V4.0 لضمان استمرارية تخليق المعرفة حتى في حالة غياب العنصر البشري.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RobotsCenter;

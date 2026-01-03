
import React from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  onSelect: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelect }) => {
  const items = [
    { id: AppSection.IDEA_LAB, label: 'مختبر الأفكار', icon: '🧪', desc: 'Core Synthesis' },
    { id: AppSection.LIVE_EXP, label: 'تجربة البث', icon: '🎙️', desc: 'Neural Uplink' },
    { id: AppSection.ECONOMY, label: 'الاقتصاد', icon: '📈', desc: 'Asset Matrix' },
    { id: AppSection.ROBOTS, label: 'الروبوتات', icon: '🤖', desc: 'Autonomous Units' },
    { id: AppSection.SOCIAL, label: 'المجتمع', icon: '🌐', desc: 'Global Mesh' },
    { id: AppSection.TERMINAL, label: 'المحطة', icon: '📟', desc: 'System Logs' },
  ];

  return (
    <aside className="w-full md:w-64 glass-panel border-l md:border-l-0 md:border-r border-white/10 flex flex-col p-4 md:sticky md:top-0 md:h-screen z-30">
      <div className="mb-10 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#bf953f] to-amber-900 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(191,149,63,0.3)]">
          🧠
        </div>
        <div>
          <div className="text-xs font-bold orbitron gold-gradient">KL-CORE</div>
          <div className="text-[8px] font-mono text-gray-500 uppercase">Secure Node v4</div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-500 group relative overflow-hidden ${
              activeSection === item.id 
                ? 'bg-[#bf953f]/10 border border-[#bf953f]/30' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeSection === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#bf953f] shadow-[0_0_10px_#bf953f]" />
            )}
            <span className={`text-lg ${activeSection === item.id ? 'scale-110' : 'opacity-60 group-hover:opacity-100'} transition-transform`}>
              {item.icon}
            </span>
            <div className="text-right flex-1">
              <div className={`text-xs font-bold ${activeSection === item.id ? 'text-[#bf953f]' : 'text-gray-400'}`}>
                {item.label}
              </div>
              <div className="text-[8px] font-mono uppercase text-gray-600 tracking-tighter">{item.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 glass-panel rounded-2xl border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-mono text-gray-500 uppercase">Uptime</span>
          <span className="text-[9px] font-mono text-[#bf953f]">99.9%</span>
        </div>
        <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-700 to-[#bf953f] w-[88%] shadow-[0_0_5px_#bf953f]" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

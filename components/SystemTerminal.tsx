
import React from 'react';
import { SystemLog } from '../types';

interface SystemTerminalProps {
  logs: SystemLog[];
}

const SystemTerminal: React.FC<SystemTerminalProps> = ({ logs }) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-amber-500">📟</span> المحطة المركزية للنظام
        </h2>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-black border border-white/10 rounded-full text-[10px] font-mono text-gray-500">
            SECURE_LINK: ENABLED
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black/80 border border-white/5 rounded-2xl p-6 font-mono text-xs overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        
        <div className="space-y-2 relative z-10">
          <div className="text-[#bf953f] mb-4">Initializing K-LIFE Terminal Matrix...</div>
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 border-b border-white/5 pb-1 animate-in fade-in slide-in-from-right-2">
              <span className="text-gray-600">[{log.timestamp}]</span>
              <span className={`font-bold ${
                log.type === 'SUCCESS' ? 'text-green-500' :
                log.type === 'ERROR' ? 'text-red-500' :
                log.type === 'WARNING' ? 'text-yellow-500' : 'text-blue-400'
              }`}>
                [{log.type}]
              </span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-gray-700 italic">No logs detected. System quiet.</div>}
        </div>
      </div>
    </div>
  );
};

export default SystemTerminal;

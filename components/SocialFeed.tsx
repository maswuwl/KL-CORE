
import React from 'react';
import { ProjectNode } from '../types';

interface SocialFeedProps {
  projects: ProjectNode[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ projects }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">بث المعرفة الحي</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono border border-white/10">ALL NODES</span>
          <span className="px-3 py-1 bg-[#bf953f]/20 text-[#bf953f] rounded-full text-[10px] font-mono border border-[#bf953f]/30">TRENDING</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-gray-600">
          لا توجد مشاريع منشورة حالياً. كن أول من يبتكر!
        </div>
      ) : (
        projects.map((p) => (
          <div key={p.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#bf953f]/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#bf953f] to-amber-900 flex items-center justify-center font-bold text-black text-xs">
                  {p.title.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 group-hover:text-[#bf953f] transition-colors">{p.title}</h4>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {new Date(p.timestamp).toLocaleString('ar-EG')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-[#bf953f]">{p.costPoints} K-PTS</div>
                <div className="text-[9px] text-gray-600 uppercase">Valuation</div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6 line-clamp-2">
              {p.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-4">
                <button className="text-gray-500 hover:text-[#bf953f] transition-all text-xs flex items-center gap-1">
                  <span>💎</span> استثمار
                </button>
                <button className="text-gray-500 hover:text-[#bf953f] transition-all text-xs flex items-center gap-1">
                  <span>💬</span> نقاش
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-gray-500">HARMONY</div>
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#bf953f]" style={{ width: `${p.harmony}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      
      <div className="py-8 text-center">
        <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-500 font-mono">
          END OF ENCRYPTED FEED - V4.0
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;

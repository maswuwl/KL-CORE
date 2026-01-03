
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ProjectNode, EconomicMetric } from '../types';

interface KnowledgeEconomyProps {
  projects: ProjectNode[];
}

const KnowledgeEconomy: React.FC<KnowledgeEconomyProps> = ({ projects }) => {
  const chartData: EconomicMetric[] = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      time: `${i}:00`,
      value: 1200 + Math.random() * 800 + (i * 10)
    }));
  }, []);

  const totalPoints = useMemo(() => projects.reduce((acc, p) => acc + p.costPoints, 0), [projects]);
  const avgHarmony = useMemo(() => 
    projects.length ? Math.round(projects.reduce((acc, p) => acc + p.harmony, 0) / projects.length) : 0
  , [projects]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border-r-2 border-[#bf953f]">
          <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase">K-TECH 100 Index</div>
          <div className="text-2xl font-bold gold-gradient tracking-tighter">1,452.80</div>
          <div className="text-[10px] text-green-500">+2.4% Today</div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase">Total Assets Capital</div>
          <div className="text-2xl font-bold text-white tracking-tighter">{totalPoints.toLocaleString()} K-PTS</div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase">Harmony Threshold</div>
          <div className="text-2xl font-bold text-[#bf953f] tracking-tighter">{avgHarmony}%</div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase">Active Nodes</div>
          <div className="text-2xl font-bold text-white tracking-tighter">{projects.length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            مؤشر السيولة المعرفية (Liquid Knowledge)
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bf953f" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#bf953f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
              <XAxis dataKey="time" stroke="#555" fontSize={10} />
              <YAxis stroke="#555" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050505', border: '1px solid #bf953f33', color: '#fff' }}
                itemStyle={{ color: '#bf953f' }}
              />
              <Area type="monotone" dataKey="value" stroke="#bf953f" fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 rounded-2xl overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">أفضل العقد المعرفية أداءً</h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[#bf953f]/30 transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold truncate ml-2">{p.title}</span>
                  <span className="text-[10px] text-green-500 font-mono">+{Math.floor(Math.random() * 20)}%</span>
                </div>
                <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-[#bf953f]" style={{ width: `${p.harmony}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeEconomy;

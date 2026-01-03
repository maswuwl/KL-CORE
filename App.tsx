
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppSection, ProjectNode, SystemLog } from './types';
import Sidebar from './components/Sidebar';
import IdeaLab from './components/IdeaLab';
import LiveExperience from './components/LiveExperience';
import KnowledgeEconomy from './components/KnowledgeEconomy';
import RobotsCenter from './components/RobotsCenter';
import SocialFeed from './components/SocialFeed';
import SystemTerminal from './components/SystemTerminal';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.IDEA_LAB);
  const [projects, setProjects] = useState<ProjectNode[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const addLog = useCallback((message: string, type: SystemLog['type'] = 'INFO') => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    addLog("تم تشغيل المحرك المركزي بنجاح", "SUCCESS");
    const saved = localStorage.getItem('knowledge_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      const initial: ProjectNode[] = [{
        id: 'init-1',
        title: 'بروتوكول تخليد المعرفة',
        description: 'تأسيس الطبقة الأولى من الوعي السيبراني المستقل.',
        roadmap: ['ربط الخلايا', 'تشفير التجربة', 'الإطلاق'],
        costPoints: 10000,
        harmony: 99,
        timestamp: new Date().toISOString(),
        status: 'STABLE'
      }];
      setProjects(initial);
    }
  }, [addLog]);

  const addProject = useCallback((project: ProjectNode) => {
    setProjects(prev => {
      const updated = [project, ...prev];
      localStorage.setItem('knowledge_projects', JSON.stringify(updated));
      return updated;
    });
    addLog(`تم تخليق عقدة معرفية جديدة: ${project.title}`, "SUCCESS");
  }, [addLog]);

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.IDEA_LAB: return <IdeaLab onPublish={addProject} addLog={addLog} />;
      case AppSection.LIVE_EXP: return <LiveExperience addLog={addLog} />;
      case AppSection.ECONOMY: return <KnowledgeEconomy projects={projects} />;
      case AppSection.ROBOTS: return <RobotsCenter />;
      case AppSection.SOCIAL: return <SocialFeed projects={projects} />;
      case AppSection.TERMINAL: return <SystemTerminal logs={logs} />;
      default: return <IdeaLab onPublish={addProject} addLog={addLog} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020202] text-white selection:bg-[#bf953f] selection:text-black">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        
        {/* Fixed Header */}
        <header className="p-6 border-b border-white/5 flex justify-between items-center z-20 glass-panel">
          <div>
            <h1 className="text-2xl font-bold orbitron gold-gradient tracking-[0.2em]">KNOWLEDGE LIFE</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Core Synchronized // V4.2.0</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-[10px] text-[#bf953f] font-mono">GLOBAL HARMONY</div>
              <div className="text-sm font-bold">98.4%</div>
            </div>
            <div className="w-10 h-10 rounded-lg border border-[#bf953f]/30 flex items-center justify-center bg-[#bf953f]/5 group cursor-pointer hover:bg-[#bf953f]/20 transition-all">
              <span className="group-hover:rotate-180 transition-transform duration-700">⚙️</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {renderSection()}
          </div>
        </div>

        {/* Floating Logs Ticker (Bottom) */}
        <footer className="h-8 border-t border-white/5 glass-panel flex items-center px-4 z-20">
          <div className="text-[9px] font-mono text-[#bf953f] mr-4 shrink-0">LATEST_LOG:</div>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="animate-[marquee_30s_linear_infinite] inline-block text-[10px] font-mono text-gray-500">
              {logs[0]?.message || "Initializing core mind sensors..."} — System Status: Stable — Memory Units: 100% — Harmony Index: Optimal — 
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bf953f; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;

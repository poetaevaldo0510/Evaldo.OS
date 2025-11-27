import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Wind, ShieldAlert, Store, BookOpen, Brain, Battery, Zap, Activity, 
  Menu, X, User, Trees, Hourglass, ScrollText, BarChart3, Terminal, Send, Lock, 
  Map, Users, Handshake, Milestone, Check, ArrowRight, Save, Briefcase, Code2, 
  FileText, Layout, Presentation, Database, Sun, Trash2
} from 'lucide-react';

// --- TYPES & INTERFACES ---

interface TerminalMessage {
  type: 'system' | 'bot' | 'user' | 'action';
  text: string;
  actionLabel?: string;
  actionTarget?: string;
  animate?: boolean;
}

interface MyApp {
  id: number;
  name: string;
  stage: string;
  progress: number;
  color: string;
  statusColor: string;
}

interface SOSItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  border: string;
  hover: string;
  audioTitle: string;
  audioDesc: string;
}

interface Product {
  name: string;
  price: number;
}

interface Feature {
  name: string;
  desc: string;
  fullDesc: string;
  releaseDate: string;
  icon: React.ElementType;
}

// --- GLOBAL STYLES ---

const GlobalStyles = () => (
  <style>{`
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    
    .bg-grid {
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 30px 30px;
    }
    
    .glass-card {
      background: rgba(20, 20, 20, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .glass-card:hover {
      border-color: rgba(212, 175, 55, 0.4);
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
    }

    .glass-card-locked {
      background: rgba(10, 10, 10, 0.6);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(4px);
    }
    .glass-card-locked:hover {
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(20, 20, 20, 0.8);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes pulse-gold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
    }

    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
    .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
    .animate-pulse-gold { animation: pulse-gold 2s infinite; }
    
    .typing-cursor::after {
      content: '|';
      animation: blink 1s step-start infinite;
    }
    
    @keyframes blink {
      50% { opacity: 0; }
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    .shadow-glow { box-shadow: 0 0 15px rgba(212,175,55,0.2); }
  `}</style>
);

// --- COMPONENTES AUXILIARES ---

const ModalOverlay = ({ children, onClose }: { children?: React.ReactNode, onClose: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-sm animate-fadeIn p-4" onClick={onClose}>
    <div className="relative w-full max-w-sm glass-card rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.15)] animate-slideUp flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-[#D4AF37] z-10 transition-colors p-2"><X className="w-5 h-5" /></button>
      <div className="overflow-y-auto p-1 scrollbar-hide">{children}</div>
    </div>
  </div>
);

const Typewriter = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const intervalId = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, 15);
    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayedText}</span>;
};

// --- TELAS ---

const WelcomeScreen = ({ navigateTo }: { navigateTo: (screen: string) => void }) => (
  <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fadeIn relative">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D4AF37] opacity-10 rounded-full blur-[80px] pointer-events-none"></div>
    <div className="relative z-10">
      <div className="mb-6 inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] uppercase tracking-[0.2em]">Sistema Operacional v.2.0</div>
      <h1 className="font-serif text-4xl text-[#F4E4BC] mb-2">Evaldo<span className="text-[#D4AF37]">.OS</span></h1>
      <p className="font-sans text-gray-500 text-xs tracking-widest uppercase mb-12">O Sistema da Mente que Lidera</p>
      <h2 className="font-serif text-2xl text-white mb-8 leading-tight">Qual é a <span className="italic text-[#D4AF37]">tempestade</span><br/> de hoje?</h2>
      <div className="w-full space-y-4 max-w-xs mx-auto">
        <button onClick={() => navigateTo('diagnosis')} className="w-full py-4 px-6 glass-card rounded-lg flex items-center justify-between group transition-all hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
          <span className="text-gray-300 font-serif text-lg group-hover:text-[#D4AF37] transition-colors">Iniciar Terminal</span>
          <Terminal className="w-5 h-5 text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
        </button>
        <button onClick={() => navigateTo('sos')} className="w-full py-4 px-6 glass-card rounded-lg flex items-center justify-between group transition-all hover:border-red-900/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.1)]">
          <span className="text-gray-300 font-serif text-lg group-hover:text-red-400 transition-colors">SOS Executivo</span>
          <ShieldAlert className="w-5 h-5 text-gray-600 group-hover:text-red-400 transition-colors" />
        </button>
        <button onClick={() => navigateTo('management')} className="w-full py-4 px-6 glass-card rounded-lg flex items-center justify-between group transition-all hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <span className="text-gray-300 font-serif text-lg group-hover:text-blue-400 transition-colors">Central de Comando</span>
          <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
        </button>
      </div>
    </div>
  </div>
);

const ManagementScreen = () => {
  const [managementTab, setManagementTab] = useState('apps');

  const myApps: MyApp[] = [
    { id: 1, name: "Evaldo.OS (Core)", stage: "Beta Test", progress: 85, color: "text-[#D4AF37]", statusColor: "bg-[#D4AF37]" },
    { id: 2, name: "Clínica Poética App", stage: "Desenvolvimento", progress: 45, color: "text-blue-400", statusColor: "bg-blue-400" },
    { id: 3, name: "CRM Humanizado", stage: "Planejamento", progress: 10, color: "text-emerald-400", statusColor: "bg-emerald-400" },
    { id: 4, name: "Negociador IA", stage: "Conceito", progress: 5, color: "text-purple-400", statusColor: "bg-purple-400" },
  ];

  const pitchModules = [
    { title: "1. O Conceito", content: "A Mente do Líder como Campo de Batalha. PCH (Poesia Cognitiva Hipnótica) aplicada à Alta Performance." },
    { title: "2. O Avatar", content: "O Empreendedor em Exaustão Elegante. Não chora, não desaba, apenas trava." },
    { title: "3. As Dores", content: "Síndrome do Impostor, Paralisia da Decisão, Solidão do Topo, Burnout Estratégico." },
    { title: "4. A Solução", content: "Ecossistema Completo: SOS, Farmácia, Morning Call, IA PCH, Diário de Bordo." },
    { title: "5. O Diferencial", content: "Não é terapia, é manutenção de hardware mental." },
    { title: "6. Modelo de Negócio", content: "SaaS B2C (Assinatura), B2B (Corporativo) e Marketplace (Upsell)." },
    { title: "7. O Futuro", content: "Ser o sistema operacional padrão de quem tem CNPJ." }
  ];

  return (
    <div className="flex flex-col h-full px-6 pt-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Layout className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="font-serif text-2xl text-white">Central</h2>
        </div>
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button onClick={() => setManagementTab('apps')} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all ${managementTab === 'apps' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Apps</button>
          <button onClick={() => setManagementTab('clinic')} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all ${managementTab === 'clinic' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Clínica</button>
          <button onClick={() => setManagementTab('pitch')} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all ${managementTab === 'pitch' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Pitch</button>
        </div>
      </div>

      {managementTab === 'apps' && (
        <div className="space-y-4 overflow-y-auto pb-24 scrollbar-hide">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="glass-card p-4 rounded-xl"><p className="text-gray-500 text-[10px] uppercase tracking-widest">Em Desenvolvimento</p><p className="text-2xl text-white font-serif mt-1">4</p></div>
            <div className="glass-card p-4 rounded-xl"><p className="text-gray-500 text-[10px] uppercase tracking-widest">Próximo Lançamento</p><p className="text-xl text-[#D4AF37] font-serif mt-1">15/Dez</p></div>
          </div>
          <h3 className="text-white font-serif text-lg mt-4 mb-2">Meus Projetos</h3>
          {myApps.map((app) => (
            <div key={app.id} className="glass-card p-5 rounded-xl border-l-4 border-l-[#D4AF37] hover:bg-white/5 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div><h4 className="text-white font-medium text-lg group-hover:text-[#D4AF37] transition-colors">{app.name}</h4><span className={`text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10 uppercase tracking-wider`}>{app.stage}</span></div>
                <div className={`p-2 rounded-full bg-white/5 ${app.color}`}><Code2 className="w-5 h-5" /></div>
              </div>
              <div className="mt-4"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progresso</span><span>{app.progress}%</span></div><div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${app.statusColor}`} style={{ width: `${app.progress}%` }}></div></div></div>
            </div>
          ))}
          <button className="w-full py-4 border border-dashed border-gray-700 text-gray-500 rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest mt-4">+ Novo Projeto</button>
        </div>
      )}

      {managementTab === 'clinic' && (
        <div className="space-y-4 overflow-y-auto pb-24 scrollbar-hide">
            <div className="glass-card p-6 rounded-xl border border-[#D4AF37]/20">
              <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/30"><Store className="w-6 h-6 text-[#D4AF37]" /></div>
                  <div><h3 className="text-white font-serif text-lg">Clínica Poética Digital</h3><p className="text-gray-500 text-xs">Performance do Negócio (SaaS)</p></div>
              </div>
              <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg"><span className="text-gray-400 text-sm flex items-center gap-2"><Users className="w-4 h-4"/> Membros Ativos</span><span className="text-white font-mono">842</span></div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg"><span className="text-gray-400 text-sm flex items-center gap-2"><Activity className="w-4 h-4"/> Sessões PCH (Mês)</span><span className="text-white font-mono">3.2k</span></div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg"><span className="text-gray-400 text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4"/> MRR (Receita)</span><span className="text-emerald-400 font-mono">R$ 42k</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 cursor-pointer transition-all"><Database className="w-8 h-8 text-gray-400" /><span className="text-gray-300 text-xs text-center">Acervo de Poesias</span></div>
              <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 cursor-pointer transition-all"><Users className="w-8 h-8 text-gray-400" /><span className="text-gray-300 text-xs text-center">Base de Líderes</span></div>
            </div>
        </div>
      )}

      {managementTab === 'pitch' && (
        <div className="space-y-4 overflow-y-auto pb-24 scrollbar-hide">
            <div className="glass-card p-6 rounded-xl border border-white/10 bg-[#050505]">
              <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><Presentation className="w-6 h-6 text-[#D4AF37]" /></div>
                  <div><h3 className="text-white font-serif text-lg">Dossiê do Projeto</h3><p className="text-gray-500 text-xs">A Bíblia do Evaldo.OS</p></div>
              </div>
              <div className="space-y-4">
                {pitchModules.map((mod, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-4 last:border-0">
                    <h4 className="text-[#D4AF37] font-serif text-sm mb-1">{mod.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{mod.content}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-[#F4E4BC] transition-all">Exportar PDF</button>
            </div>
        </div>
      )}
    </div>
  );
};

const DiagnosisScreen = ({ 
  terminalHistory, 
  setTerminalHistory, 
  terminalInput, 
  setTerminalInput, 
  handleTerminalSubmit, 
  navigateTo 
}: { 
  terminalHistory: TerminalMessage[], 
  setTerminalHistory: React.Dispatch<React.SetStateAction<TerminalMessage[]>>, 
  terminalInput: string, 
  setTerminalInput: (val: string) => void, 
  handleTerminalSubmit: (e: React.FormEvent) => void,
  navigateTo: (screen: string) => void
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleClear = () => {
    setTerminalHistory([
      { type: 'system', text: 'Terminal limpo. Sistema reiniciado.', animate: true }
    ]);
  };

  const handleSave = () => {
     const logContent = terminalHistory.map(m => `[${m.type.toUpperCase()}] ${m.text}`).join('\n');
     const blob = new Blob([logContent], { type: 'text/plain' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `evaldo-log-${new Date().toISOString().slice(0,10)}.txt`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
  };

  const finishAnimation = (index: number) => {
    setTerminalHistory(prev => prev.map((msg, i) => i === index ? { ...msg, animate: false } : msg));
  };

  return (
    <div className="flex flex-col h-full px-4 pt-8 pb-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="font-serif text-xl text-white">Terminal</h2>
        </div>
        <div className="flex gap-2">
           <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#D4AF37] transition-colors" title="Salvar Log"><Save className="w-4 h-4" /></button>
           <button onClick={handleClear} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Limpar Terminal"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex-1 glass-card rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col mb-4 bg-black/40">
         <div className="flex gap-2 mb-4 opacity-50"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
         <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide select-text">
            {terminalHistory.map((msg, idx) => (
              <div key={idx} className={`${msg.type === 'system' ? 'text-green-500' : msg.type === 'bot' ? 'text-[#F4E4BC]' : msg.type === 'action' ? 'text-[#D4AF37]' : 'text-white text-right'}`}>
                {msg.type !== 'user' && <span className="mr-2 opacity-50 select-none">{'>'}</span>}
                {msg.animate && msg.type !== 'user' ? (
                   <Typewriter text={msg.text} onComplete={() => finishAnimation(idx)} />
                ) : (
                   <span>{msg.text}</span>
                )}
                {msg.type === 'action' && msg.actionTarget && (
                  <button onClick={() => navigateTo(msg.actionTarget!)} className="block mt-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] text-xs rounded hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-2 select-none">{msg.actionLabel} <ArrowRight className="w-3 h-3" /></button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
         </div>
      </div>
      <form onSubmit={handleTerminalSubmit} className="relative">
        <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Tente: 'medo', 'decisão', 'pitch'..." className="w-full bg-[#121212] border border-white/10 rounded-lg p-4 pr-12 text-white focus:outline-none focus:border-[#D4AF37] font-sans placeholder:text-gray-700" />
        <button type="submit" className="absolute right-3 top-3 text-gray-500 hover:text-[#D4AF37]"><Send className="w-6 h-6" /></button>
      </form>
    </div>
  );
};

const SOSScreen = ({ openSOSPlayer, navigateTo }: { openSOSPlayer: (item: SOSItem) => void, navigateTo: (screen: string) => void }) => {
  const sosItems: SOSItem[] = [
    { id: 'risk', icon: Zap, label: "Medo de Arriscar", color: "text-[#D4AF37]", border: "border-[#D4AF37]/30", hover: "hover:border-[#D4AF37]", audioTitle: "O Salto no Escuro", audioDesc: "A coragem não é ausência de medo. É agir tremendo." },
    { id: 'burnout', icon: Battery, label: "Exaustão Extrema", color: "text-blue-400", border: "border-blue-500/30", hover: "hover:border-blue-400", audioTitle: "Bateria de Reserva", audioDesc: "Desligar não é desistir. É manutenção estratégica." },
    { id: 'paralysis', icon: Brain, label: "Paralisia de Decisão", color: "text-purple-400", border: "border-purple-500/30", hover: "hover:border-purple-400", audioTitle: "O Movimento Cura", audioDesc: "O erro é dado estatístico. A estagnação é morte." },
    { id: 'anger', icon: Activity, label: "Raiva / Explosão", color: "text-red-400", border: "border-red-500/30", hover: "hover:border-red-400", audioTitle: "O Silêncio do Mestre", audioDesc: "Gritar é fraqueza. O verdadeiro poder fala baixo." },
  ];
  return (
    <div className="flex flex-col h-full px-6 pt-10 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="w-6 h-6 text-red-500" />
        <h2 className="font-serif text-2xl text-white">Protocolo SOS</h2>
      </div>
      <p className="text-gray-500 text-sm mb-8 font-light">Selecione a emergência. A intervenção será imediata.</p>
      <div className="grid grid-cols-1 gap-4">
        {sosItems.map((item, idx) => (
          <button key={idx} onClick={() => openSOSPlayer(item)} className={`p-5 glass-card border ${item.border} rounded-xl flex items-center gap-4 transition-all ${item.hover} hover:bg-white/5 active:scale-95 group`}>
            <div className={`p-2 rounded-lg bg-black/50 ${item.color} group-hover:scale-110 transition-transform`}><item.icon className="w-6 h-6" /></div>
            <span className="text-gray-200 font-serif text-lg">{item.label}</span>
          </button>
        ))}
      </div>
      <button onClick={() => navigateTo('welcome')} className="mt-auto mb-8 text-center text-gray-600 text-xs uppercase tracking-widest hover:text-white transition-colors">Cancelar Protocolo</button>
    </div>
  );
};

const EmporioScreen = ({ 
  seeds, 
  navigateTo, 
  openPurchaseModal, 
  openFeaturePreview 
}: { 
  seeds: number, 
  navigateTo: (screen: string) => void, 
  openPurchaseModal: (p: Product) => void, 
  openFeaturePreview: (f: Feature) => void 
}) => {
  const journeyPhases = [
      {
        title: "Fase 1: O Resgate",
        subtitle: "Estabilizando a mente do líder.",
        items: [
          { id: 'descompressor', name: "O Descompressor", desc: "Frequências binaurais para sono profundo.", icon: Wind, color: "text-blue-400", bgColor: "bg-blue-900/20", status: 'available', price: 20, action: () => openPurchaseModal({ name: "Descompressor Noturno", price: 20 }), badge: "" }
        ]
      },
      {
        title: "Fase 2: A Clareza",
        subtitle: "Eliminando o ruído da decisão.",
        items: [
          { id: 'oracle', name: "Oráculo de Decisão", desc: "IA Socrática para dilemas complexos.", icon: BookOpen, color: "text-[#D4AF37]", bgColor: "bg-[#D4AF37]/10", status: 'available', action: () => navigateTo('oracle'), badge: "Acesso Gratuito", price: 0 }
        ]
      },
      {
        title: "Fase 3: A Performance",
        subtitle: "Construindo o império.",
        items: [
          { id: 'pomodoro', name: "Foco Poético", desc: "Fluxo de trabalho com pausas sábias.", icon: Hourglass, color: "text-emerald-500", bgColor: "bg-emerald-900/20", status: 'installed', action: () => navigateTo('pomodoro'), badge: "Instalado", price: 0 }
        ]
      },
      {
        title: "Fase 4: O Legado",
        subtitle: "Ferramentas futuras (Pré-visualização).",
        items: [
          { id: 'negotiator', name: "O Negociador Estoico", desc: "Scripts para conversas difíceis.", fullDesc: "Scripts comportamentais baseados em Sêneca.", icon: Handshake, color: "text-gray-400", bgColor: "bg-gray-800/30", status: 'coming_soon', action: () => openFeaturePreview({ name: "O Negociador Estoico", desc: "Scripts para conversas difíceis.", fullDesc: "Uma base de dados de scripts comportamentais baseados em Sêneca e Marcus Aurelius.", releaseDate: "Dezembro 2025", icon: Handshake }), badge: "", price: 0 },
          { id: 'crm', name: "CRM Humanizado", desc: "Gestão de relacionamentos.", fullDesc: "Esqueça funis frios. Rastreie a 'Saúde do Relacionamento'.", icon: Users, color: "text-gray-400", bgColor: "bg-gray-800/30", status: 'coming_soon', action: () => openFeaturePreview({ name: "CRM Humanizado", desc: "Gestão de relacionamentos.", fullDesc: "Esqueça os funis de vendas frios. Este CRM rastreia a 'Saúde do Relacionamento'.", releaseDate: "Janeiro 2026", icon: Users }), badge: "", price: 0 }
        ]
      }
  ];

  return (
  <div className="flex flex-col h-full px-6 pt-6 animate-fadeIn overflow-y-auto pb-20 scrollbar-hide">
    <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#050505]/95 backdrop-blur z-10 py-2 border-b border-white/5">
      <div className="flex items-center gap-2"><Map className="w-5 h-5 text-[#D4AF37]" /><h2 className="font-serif text-2xl text-[#D4AF37]">A Jornada</h2></div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10"><span className="text-[#D4AF37] text-xs">🌰</span><span className="text-[#F4E4BC] text-xs font-mono">{seeds}</span></div>
    </div>
    {journeyPhases.map((phase, index) => (
      <div key={index} className="mb-10 relative">
        {index !== journeyPhases.length - 1 && (<div className="absolute left-[19px] top-12 bottom-[-40px] w-0.5 bg-gradient-to-b from-[#D4AF37]/30 to-transparent"></div>)}
        <div className="flex items-start gap-4 mb-4">
           <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 bg-[#050505] flex items-center justify-center text-[#D4AF37] font-serif text-lg z-10 shadow-[0_0_15px_rgba(212,175,55,0.1)]">{index + 1}</div>
           <div><h3 className="text-white font-serif text-lg leading-none mb-1">{phase.title}</h3><p className="text-gray-500 text-xs uppercase tracking-wide">{phase.subtitle}</p></div>
        </div>
        <div className="pl-14 space-y-4">
          {phase.items.map((item, i) => (
            <div key={i} onClick={item.action} className={`p-5 rounded-2xl relative transition-all group ${item.status === 'coming_soon' ? 'glass-card-locked cursor-pointer' : 'glass-card cursor-pointer hover:border-[#D4AF37]/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)]'}`}>
               {item.status === 'coming_soon' && (<div className="absolute top-4 right-4 z-10"><div className="bg-black/50 px-2 py-1 rounded border border-white/10 flex items-center gap-2"><Lock className="w-3 h-3 text-gray-400" /><span className="text-[10px] text-gray-300 uppercase tracking-widest">Em Breve</span></div></div>)}
               {item.badge && (<div className={`absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide ${item.status === 'installed' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'}`}>{item.badge}</div>)}
               <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor} ${item.color}`}><item.icon className="w-6 h-6" /></div>
                  <div className="flex-1 pr-16">
                     <h3 className={`font-serif text-lg mb-1 ${item.status === 'coming_soon' ? 'text-gray-400' : 'text-white'}`}>{item.name}</h3>
                     <p className="text-gray-500 text-xs leading-relaxed font-light">{item.desc}</p>
                     {item.price > 0 && (<div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3"><span className="text-[#F4E4BC] font-bold text-sm">{item.price} 🌰</span><span className="text-[10px] text-[#D4AF37] uppercase border border-[#D4AF37]/30 px-2 py-1 rounded hover:bg-[#D4AF37] hover:text-black transition-colors">Adquirir</span></div>)}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};

const OracleScreen = ({ 
  oracleStep, 
  setOracleStep, 
  oracleQuery, 
  setOracleQuery, 
  saveToJournal, 
  saveSuccess 
}: { 
  oracleStep: number, 
  setOracleStep: (step: number) => void, 
  oracleQuery: string, 
  setOracleQuery: (q: string) => void, 
  saveToJournal: () => void, 
  saveSuccess: boolean 
}) => {
  const handleAsk = () => {
    if (!oracleQuery.trim()) return;
    setOracleStep(1);
    setTimeout(() => setOracleStep(2), 3000);
  };
  return (
    <div className="flex flex-col h-full px-6 pt-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center"><BookOpen className="w-5 h-5 text-[#D4AF37]" /></div><h2 className="font-serif text-2xl text-white">O Oráculo</h2></div>
      {oracleStep === 0 && (
        <div className="flex flex-col h-full">
          <p className="text-[#F4E4BC] mb-8 font-serif italic text-xl text-center mt-6 leading-relaxed">"Deposite aqui o dilema que pesa no peito. A clareza virá."</p>
          <div className="relative">
            <textarea className="w-full h-48 glass-card rounded-xl p-6 text-white focus:border-[#D4AF37] focus:outline-none resize-none font-serif placeholder:text-gray-700 text-lg leading-relaxed shadow-inner" placeholder="Ex: Devo vender a minha empresa ou continuar a lutar sozinho?" value={oracleQuery} onChange={(e) => setOracleQuery(e.target.value)} />
            <div className="absolute bottom-4 right-4 text-gray-600 text-xs">IA Socrática v2</div>
          </div>
          <button onClick={handleAsk} className="mt-8 w-full py-4 bg-[#D4AF37] text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest text-sm transform hover:-translate-y-1">Consultar a Sabedoria</button>
        </div>
      )}
      {oracleStep === 1 && (<div className="flex flex-col items-center justify-center h-full pb-20"><div className="relative w-32 h-32 mb-8"><div className="absolute inset-0 border border-white/10 rounded-full"></div><div className="absolute inset-0 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div><div className="absolute inset-4 border border-white/5 rounded-full animate-pulse"></div></div><p className="text-[#D4AF37] font-serif text-lg animate-pulse tracking-wide">Destilando a verdade...</p></div>)}
      {oracleStep === 2 && (
        <div className="flex flex-col h-full overflow-y-auto pb-6 scrollbar-hide">
          <div className="glass-card border-[#D4AF37]/30 rounded-xl p-8 mb-6 relative"><div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#050505] px-4 text-[#D4AF37] text-xs uppercase tracking-[0.2em] border border-[#D4AF37]/30 rounded-full">A Metáfora</div><p className="text-[#F4E4BC] font-serif text-lg leading-relaxed italic text-center">"Você é um jardineiro cansado de carregar baldes, a contemplar a venda do jardim para uma fábrica de cimento. O peso dos baldes passa, mas a falta das flores é eterna."</p></div>
          <div className="glass-card rounded-xl p-6 mb-8"><h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Diretriz Estoica</h3><p className="text-gray-300 text-sm leading-relaxed font-light">Não decida pelo cansaço. O cansaço é temporário, a venda é definitiva. <strong className="text-white">Ação Sugerida:</strong> Delegue o transporte da água (operacional) antes de vender a terra (propriedade).</p></div>
          <div className="flex gap-3 mt-auto"><button onClick={() => setOracleStep(0)} className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-lg text-xs uppercase tracking-widest transition-all">Nova Consulta</button><button onClick={saveToJournal} className={`flex-1 py-3 border border-[#D4AF37] ${saveSuccess ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]'} rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2`}>{saveSuccess ? <Check className="w-4 h-4"/> : <Save className="w-4 h-4" />} {saveSuccess ? 'Salvo' : 'Salvar no Diário'}</button></div>
        </div>
      )}
    </div>
  );
};

const PomodoroScreen = ({ timerActive, setTimerActive, timeLeft }: { timerActive: boolean, setTimerActive: (a: boolean) => void, timeLeft: number }) => (
  <div className="flex flex-col h-full px-6 pt-8 animate-fadeIn items-center">
    <div className="flex items-center gap-3 mb-16 self-start"><Hourglass className="w-5 h-5 text-emerald-500" /><h2 className="font-serif text-2xl text-white">Foco Poético</h2></div>
    <div className="relative w-72 h-72 mb-16 flex items-center justify-center"><div className="absolute inset-0 rounded-full border border-white/5"></div><svg className="w-full h-full transform -rotate-90"><circle cx="144" cy="144" r="135" stroke="#121212" strokeWidth="2" fill="transparent" /><circle cx="144" cy="144" r="135" stroke="#10b981" strokeWidth="2" fill="transparent" strokeDasharray={2 * Math.PI * 135} strokeDashoffset={2 * Math.PI * 135 * (1 - timeLeft / (25 * 60))} className="transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(16,185,129,0.3)]" /></svg><div className="absolute flex flex-col items-center"><div className="text-6xl font-sans font-light text-white tracking-widest">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{ (timeLeft % 60).toString().padStart(2, '0') }</div><div className="text-xs text-emerald-500 uppercase tracking-[0.3em] mt-2">Fluxo Ativo</div></div></div>
    <p className="text-gray-500 text-center max-w-xs mb-12 h-12 font-serif italic text-lg">{timerActive ? "\"O mundo lá fora silencia. Apenas a sua obra importa agora.\"" : "\"A disciplina é a ponte entre a meta e a realização.\""}</p>
    <button onClick={() => setTimerActive(!timerActive)} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${timerActive ? 'bg-[#121212] border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/30' : 'bg-emerald-900/20 border border-emerald-500/50 text-emerald-500 hover:scale-105 hover:bg-emerald-900/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]'}`}>{timerActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}</button>
  </div>
);

const MorningCallScreen = ({ isPlaying, setIsPlaying, navigateTo }: { isPlaying: boolean, setIsPlaying: (v: boolean) => void, navigateTo: (s: string) => void }) => (
  <div className="flex flex-col h-full px-6 pt-10 animate-fadeIn items-center text-center">
    <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 border border-[#D4AF37]/30 shadow-glow">
       <Sun className="w-10 h-10 text-[#D4AF37]" />
    </div>
    <h2 className="font-serif text-2xl text-white mb-2">Prescrição Matinal</h2>
    <p className="text-gray-400 text-sm mb-8 font-light italic">"A primeira batalha é vencida ao acordar."</p>
    
    <div className="w-full glass-card p-6 rounded-xl text-left mb-8 border border-white/10">
       <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">Sabedoria do Dia</h3>
       <p className="text-white font-serif text-lg leading-relaxed">
         "Não confunda movimento com progresso. Hoje, escolha três batalhas que realmente importam e deixe o resto queimar em silêncio."
       </p>
    </div>

    <button onClick={() => setIsPlaying(!isPlaying)} className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all mb-8 shadow-2xl">
        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
    </button>

    <button onClick={() => navigateTo('welcome')} className="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white">Voltar ao Início</button>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [seeds, setSeeds] = useState(120); 
  const [journalCount, setJournalCount] = useState(12);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedSOS, setSelectedSOS] = useState<SOSItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null); 
  const [purchaseSuccess, setPurchaseSuccess] = useState(false); 
  const [saveSuccess, setSaveSuccess] = useState(false); 
  
  // Oracle State
  const [oracleStep, setOracleStep] = useState(0);
  const [oracleQuery, setOracleQuery] = useState('');

  // Pomodoro State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalMessage[]>([
    { type: 'system', text: 'Inicializando Evaldo.OS v1.0...' },
    { type: 'system', text: 'Carregando módulos de empatia...' },
    { type: 'bot', text: 'Olá. Qual é a tempestade que você enfrenta hoje?' }
  ]);

  // Effects
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Actions
  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
    setMenuOpen(false);
    setIsPlaying(false);
    setProgress(0);
    setActiveModal(null);
    setOracleStep(0);
  };

  const openSOSPlayer = (sosItem: SOSItem) => {
    setSelectedSOS(sosItem);
    setActiveModal('sos-player');
    setIsPlaying(true);
    setProgress(0);
  };

  const openPurchaseModal = (product: Product) => {
    setSelectedProduct(product);
    setPurchaseSuccess(false); 
    setActiveModal('purchase');
  };

  const openFeaturePreview = (feature: Feature) => {
    setSelectedFeature(feature);
    setActiveModal('feature-preview');
  };

  const openManifesto = () => {
    setMenuOpen(false);
    setActiveModal('manifesto');
  };

  const openProfile = () => {
    setMenuOpen(false);
    setActiveModal('profile');
  };

  const confirmPurchase = () => {
    if (selectedProduct && seeds >= selectedProduct.price) {
      setSeeds(prev => prev - selectedProduct.price);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
        setPurchaseSuccess(false);
      }, 2000);
    } else {
      alert("Sementes insuficientes.");
    }
  };

  const saveToJournal = () => {
    setSaveSuccess(true);
    setJournalCount(prev => prev + 1);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const newHistory: TerminalMessage[] = [...terminalHistory, { type: 'user', text: terminalInput }];
    setTerminalHistory(newHistory);
    
    const lowerInput = terminalInput.toLowerCase();
    setTerminalInput('');

    setTimeout(() => {
      let botResponse: TerminalMessage = { type: 'bot', text: '', animate: true };
      let actionResponse: TerminalMessage | null = null;

      if (lowerInput.includes('medo') || lowerInput.includes('ansiedade') || lowerInput.includes('pânico')) {
        botResponse.text = "Detectei sinais de alerta. Sua mente precisa de blindagem imediata.";
        actionResponse = { type: 'action', text: 'Ativar Protocolo de Emergência', actionLabel: 'Abrir SOS', actionTarget: 'sos' };
      } else if (lowerInput.includes('dúvida') || lowerInput.includes('decisão')) {
        botResponse.text = "A indecisão drena energia. Vamos buscar clareza.";
        actionResponse = { type: 'action', text: 'Consultar o Oráculo', actionLabel: 'Ir para Oráculo', actionTarget: 'oracle' };
      } else if (lowerInput.includes('trabalho') || lowerInput.includes('foco')) {
        botResponse.text = "Ação sem direção é apenas ruído. Vamos focar.";
        actionResponse = { type: 'action', text: 'Iniciar Sessão de Foco', actionLabel: 'Abrir Pomodoro', actionTarget: 'pomodoro' };
      } else if (lowerInput.includes('app') || lowerInput.includes('projeto') || lowerInput.includes('pitch')) {
        botResponse.text = "Acessando banco de dados de desenvolvimento. Abrindo central de comando.";
        actionResponse = { type: 'action', text: 'Gerenciar Projetos', actionLabel: 'Abrir Gestão', actionTarget: 'management' };
      } else {
        botResponse.text = "Entendi. Às vezes precisamos apenas pausar e recalibrar.";
        actionResponse = { type: 'action', text: 'Recomendo iniciar com sabedoria.', actionLabel: 'Ouvir Prescrição', actionTarget: 'morning-call' };
      }

      setTerminalHistory(prev => [...prev, botResponse]);
      setTimeout(() => {
         if(actionResponse) setTerminalHistory(prev => [...prev, actionResponse]);
      }, 800);
    }, 800);
  };

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#020202] font-sans selection:bg-[#D4AF37] selection:text-black bg-grid">
        <div className="w-full max-w-md h-[850px] bg-[#050505] relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5 sm:rounded-[2.5rem]">
          {/* Top Bar */}
          <div className="absolute top-0 w-full h-20 flex justify-between items-end pb-4 px-6 z-20 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-transparent">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Menu className="w-6 h-6" /></button>
            <div className="flex gap-2 mb-1.5"><Brain className="w-5 h-5 text-[#D4AF37] opacity-50" /></div>
            <button onClick={openProfile} className="text-gray-400 hover:text-[#D4AF37] transition-colors relative"><User className="w-6 h-6" />{journalCount > 12 && <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>}</button>
          </div>

          {/* Side Menu */}
          {menuOpen && (
            <div className="absolute inset-0 z-50 bg-[#050505]/98 backdrop-blur-xl animate-fadeIn flex flex-col p-8">
               <button onClick={() => setMenuOpen(false)} className="self-end text-gray-500 hover:text-white mb-12"><X className="w-8 h-8"/></button>
               <nav className="flex flex-col gap-8 font-serif text-3xl text-gray-300">
                 <button onClick={() => navigateTo('welcome')} className="text-left hover:text-[#D4AF37] transition-colors">Início</button>
                 <button onClick={() => navigateTo('management')} className="text-left hover:text-blue-400 transition-colors">Gestão de Apps</button>
                 <button onClick={() => navigateTo('diagnosis')} className="text-left hover:text-[#D4AF37] transition-colors">Terminal</button>
                 <button onClick={() => navigateTo('sos')} className="text-left hover:text-red-500 transition-colors">SOS Protocol</button>
                 <button onClick={() => navigateTo('emporio')} className="text-left hover:text-emerald-500 transition-colors">Sua Jornada</button>
                 <div className="h-px bg-white/10 my-4 w-12"></div>
                 <button onClick={openManifesto} className="text-left text-lg text-[#D4AF37] flex items-center gap-3 font-sans uppercase tracking-widest"><ScrollText className="w-4 h-4" /> Manifesto</button>
                 <button onClick={openProfile} className="text-left text-lg text-gray-600 hover:text-white transition-colors font-sans uppercase tracking-widest">Perfil</button>
               </nav>
            </div>
          )}

          {/* Modals */}
          {activeModal === 'sos-player' && selectedSOS && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <div className="flex flex-col items-center pt-2 pb-2">
                <div className={`p-4 rounded-full bg-[#050505] border border-white/5 ${selectedSOS.color} mb-6 shadow-glow`}><selectedSOS.icon className="w-8 h-8" /></div>
                <h3 className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mb-3">Intervenção Imediata</h3>
                <h2 className="font-serif text-2xl text-white text-center mb-3">{selectedSOS.audioTitle}</h2>
                <p className="text-gray-400 text-center text-xs mb-8 italic px-4 font-serif leading-relaxed">"{selectedSOS.audioDesc}"</p>
                <div className="w-full bg-white/10 h-0.5 rounded-full mb-8 overflow-hidden"><div className="bg-red-500 h-full transition-all duration-100" style={{ width: `${progress}%` }} /></div>
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all mb-8">{isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}</button>
                <div className="w-full flex gap-3"><button onClick={() => { setActiveModal(null); navigateTo('pomodoro'); }} className="flex-1 py-2 text-[10px] uppercase tracking-widest text-emerald-500 border border-emerald-500/30 rounded hover:bg-emerald-500/10">Voltar ao Foco</button><button onClick={() => { setActiveModal(null); navigateTo('emporio'); }} className="flex-1 py-2 text-[10px] uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 rounded hover:bg-[#D4AF37]/10">Ir para Empório</button></div>
              </div>
            </ModalOverlay>
          )}

          {activeModal === 'purchase' && selectedProduct && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              {purchaseSuccess ? (
                <div className="text-center pt-8 pb-4 animate-fadeIn"><div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-8 h-8 text-emerald-500 animate-slideUp" /></div><h3 className="font-serif text-xl text-white mb-2">Aquisição Confirmada</h3><p className="text-gray-400 text-sm">Sua ferramenta foi desbloqueada.</p></div>
              ) : (
                <div className="text-center pt-2 px-2"><div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6"><Store className="w-6 h-6 text-[#D4AF37]" /></div><h3 className="font-serif text-2xl text-white mb-2">Confirmar Aquisição</h3><p className="text-gray-400 text-sm mb-8 font-light">Investir <strong className="text-white">{selectedProduct.price} sementes</strong> para desbloquear <br/>"{selectedProduct.name}"?</p><div className="flex gap-3"><button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-white/10 rounded-lg text-gray-400 text-xs uppercase tracking-widest hover:text-white hover:border-white/30 transition-all">Cancelar</button><button onClick={confirmPurchase} className="flex-1 py-3 bg-[#D4AF37] text-black rounded-lg text-xs uppercase tracking-widest hover:bg-[#F4E4BC] transition-all font-bold">Confirmar</button></div></div>
              )}
            </ModalOverlay>
          )}

          {activeModal === 'feature-preview' && selectedFeature && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <div className="pt-2 px-2">
                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6"><div className="w-14 h-14 bg-gray-800/50 rounded-xl flex items-center justify-center border border-white/5"><selectedFeature.icon className="w-7 h-7 text-gray-400" /></div><div><span className="text-[10px] text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/30 px-2 py-0.5 rounded">Em Desenvolvimento</span><h3 className="font-serif text-xl text-white mt-2">{selectedFeature.name}</h3></div></div>
                <div className="space-y-6"><div><h4 className="text-gray-500 text-xs uppercase tracking-widest mb-2">O Conceito</h4><p className="text-gray-300 text-sm leading-relaxed font-light">{selectedFeature.fullDesc}</p></div><div className="bg-white/5 p-4 rounded-lg border border-white/5"><h4 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Previsão de Lançamento</h4><p className="text-white font-mono text-sm">{selectedFeature.releaseDate}</p></div><button className="w-full py-3 border border-dashed border-gray-600 text-gray-400 rounded-lg text-xs uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Entrar na Lista de Espera</button></div>
              </div>
            </ModalOverlay>
          )}

          {activeModal === 'manifesto' && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <div className="text-center pt-4 px-2"><Trees className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 opacity-80" /><h3 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">O Manifesto</h3><div className="text-gray-300 font-serif text-lg leading-loose space-y-6 italic text-left px-2"><p>"Todo empreendedor tem duas empresas: a que ele administra… e a que vive dentro da cabeça."</p><p>"Quando essa aqui quebra… a outra desmorona."</p><p>"Por isso nasceu o Evaldo.OS."</p><p className="text-[#D4AF37] font-sans font-bold not-italic text-center pt-6 text-xs tracking-widest uppercase">"Sua mente blindada. Sua alma inspirada."</p></div><button onClick={() => setActiveModal(null)} className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs uppercase tracking-widest transition-colors border border-white/5">Entendido</button></div>
            </ModalOverlay>
          )}

          {activeModal === 'profile' && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <div className="pt-2 px-2"><div className="flex items-center gap-5 mb-8"><div className="w-16 h-16 rounded-full bg-[#050505] border border-[#D4AF37] flex items-center justify-center shadow-glow"><User className="w-8 h-8 text-gray-400" /></div><div><h3 className="font-serif text-xl text-white">Líder Visionário</h3><p className="text-[#D4AF37] text-[10px] uppercase tracking-widest mt-1">Nível 4 • Arquiteto</p></div></div><div className="space-y-3 mb-8"><div className="glass-card p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => alert("Diário aberto (Simulação)")}><span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-3"><ScrollText className="w-4 h-4 text-[#D4AF37]"/> Diário de Bordo</span><span className="text-white font-mono text-sm">{journalCount}</span></div><div className="glass-card p-4 rounded-lg flex justify-between items-center"><span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-3"><BarChart3 className="w-4 h-4 text-emerald-500"/> Evolução Mental</span><span className="text-emerald-400 font-mono text-sm">+15%</span></div></div><button onClick={() => setActiveModal(null)} className="mt-2 w-full py-3 border border-white/10 text-gray-500 rounded-lg text-xs uppercase tracking-widest hover:text-white hover:border-white/30 transition-colors">Fechar</button></div>
            </ModalOverlay>
          )}

          {/* Screen Content */}
          <div className="h-full pt-20 pb-24 overflow-y-auto scrollbar-hide">
            {currentScreen === 'welcome' && <WelcomeScreen navigateTo={navigateTo} />}
            {currentScreen === 'diagnosis' && (
              <DiagnosisScreen 
                terminalHistory={terminalHistory}
                setTerminalHistory={setTerminalHistory}
                terminalInput={terminalInput}
                setTerminalInput={setTerminalInput}
                handleTerminalSubmit={handleTerminalSubmit}
                navigateTo={navigateTo}
              />
            )}
            {currentScreen === 'morning-call' && <MorningCallScreen isPlaying={isPlaying} setIsPlaying={setIsPlaying} navigateTo={navigateTo} />}
            {currentScreen === 'sos' && <SOSScreen openSOSPlayer={openSOSPlayer} navigateTo={navigateTo} />}
            {currentScreen === 'emporio' && (
              <EmporioScreen 
                seeds={seeds} 
                navigateTo={navigateTo} 
                openPurchaseModal={openPurchaseModal}
                openFeaturePreview={openFeaturePreview}
              />
            )}
            {currentScreen === 'oracle' && (
              <OracleScreen 
                oracleStep={oracleStep}
                setOracleStep={setOracleStep}
                oracleQuery={oracleQuery}
                setOracleQuery={setOracleQuery}
                saveToJournal={saveToJournal}
                saveSuccess={saveSuccess}
              />
            )}
            {currentScreen === 'pomodoro' && (
              <PomodoroScreen 
                timerActive={timerActive}
                setTimerActive={setTimerActive}
                timeLeft={timeLeft}
              />
            )}
            {currentScreen === 'management' && <ManagementScreen />}
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] h-16 glass-card rounded-2xl flex justify-around items-center px-4 shadow-2xl z-30">
              <button onClick={() => navigateTo('welcome')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'welcome' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-500 hover:text-gray-300'}`}><Trees className="w-5 h-5" /></button>
              <button onClick={() => navigateTo('management')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'management' ? 'text-blue-400 bg-blue-900/20' : 'text-gray-500 hover:text-gray-300'}`}><Briefcase className="w-5 h-5" /></button>
              <button onClick={() => navigateTo('diagnosis')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'diagnosis' || currentScreen === 'morning-call' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-500 hover:text-gray-300'}`}><Terminal className="w-5 h-5" /></button>
              <button onClick={() => navigateTo('sos')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'sos' ? 'text-red-500 bg-red-900/20' : 'text-gray-500 hover:text-gray-300'}`}><ShieldAlert className="w-5 h-5" /></button>
              <button onClick={() => navigateTo('emporio')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'emporio' || currentScreen === 'oracle' || currentScreen === 'pomodoro' ? 'text-emerald-500 bg-emerald-900/20' : 'text-gray-500 hover:text-gray-300'}`}><Store className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
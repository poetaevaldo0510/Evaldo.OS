
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Wind, ShieldAlert, Store, BookOpen, Brain, Battery, Zap, Activity, 
  Menu, X, User, Trees, Hourglass, ScrollText, BarChart3, Terminal, Send, Lock, 
  Map, Users, Handshake, Milestone, Check, ArrowRight, Save, Briefcase, Code2, 
  FileText, Layout, Presentation, Database, Sun, Trash2, HeartPulse, Calendar,
  Sparkles, MessageCircle, Mic, RefreshCw, Copy, Heart, ChevronRight, GraduationCap, 
  Lightbulb, CheckCircle2, XCircle, Eye, Music, Trophy, Flame, Feather, BarChart2, 
  Volume2, Target, Gem, Mountain, Shield, Star, CheckSquare, Crown, Medal, VolumeX, 
  Headphones, AlertTriangle, Thermometer, Ghost, Scale, Clock, List, Smile, ThumbsUp, 
  Search, TrendingUp, Minimize2, Maximize2, Compass, AlertCircle, Type, Plus, ShoppingBag, Download
} from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// --- HELPERS ---

// Safe access to process.env for Vercel/Vite environments
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

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
  action?: string; // Action trigger for specific apps
  price?: number;
  installed?: boolean;
  description?: string;
  icon?: React.ElementType;
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
  id?: number; // Added optional ID for app purchases
}

interface Feature {
  name: string;
  desc: string;
  fullDesc: string;
  releaseDate: string;
  icon: React.ElementType;
}

// Sales Alchemist Types
type Module = {
  id: number;
  title: string;
  description: string;
  locked: boolean;
  content?: React.ReactNode;
};

type Card = {
  id: string;
  name: string;
  type: 'Habilidade' | 'Produto' | 'Cliente';
  rarity: 'Comum' | 'Rara' | 'Lendária';
  description: string;
};

type Region = {
  id: number;
  name: string;
  desc: string;
  levelReq: number;
  icon: React.ReactNode;
  color: string;
};

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

    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); } }
    @keyframes wave { 0%, 100% { height: 20%; } 50% { height: 80%; } }
    @keyframes ping-slow { 75%, 100% { transform: scale(1.5); opacity: 0; } }

    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
    .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
    .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
    .animate-pulse-gold { animation: pulse-gold 2s infinite; }
    .animate-wave { animation: wave 1s ease-in-out infinite; }
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    
    .typing-cursor::after { content: '▋'; animation: blink 1s step-start infinite; color: #D4AF37; margin-left: 2px; }
    @keyframes blink { 50% { opacity: 0; } }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    .shadow-glow { box-shadow: 0 0 15px rgba(212,175,55,0.2); }
  `}</style>
);

// --- LANDING PAGE COMPONENTS ---

const LandingPage = ({ onLaunch }: { onLaunch: () => void }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#8c7324] rounded-lg flex items-center justify-center">
                    <Brain className="text-black w-5 h-5" />
                </div>
                <span className="font-serif text-xl tracking-tight">Evaldo<span className="text-[#D4AF37]">.OS</span></span>
            </div>
            {/* CTA */}
            <button onClick={onLaunch} className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-[#D4AF37] transition-colors">
                Launch OS
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-xs font-medium mb-8 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            System v2.0 Live
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8 animate-slideUp">
            The Operating System <br/> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4E4BC]">High-Performance Minds</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slideUp" style={{animationDelay: '0.1s'}}>
             Blind your mind against burnout, paralysis, and chaos. A suite of cognitive tools designed for visionary leaders.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-slideUp" style={{animationDelay: '0.2s'}}>
             <button onClick={onLaunch} className="w-full md:w-auto px-8 py-4 bg-[#D4AF37] text-black rounded-xl font-bold text-lg hover:bg-[#F4E4BC] transition-all flex items-center justify-center gap-2">
                <Terminal size={20} /> Initialize System
             </button>
             <button className="w-full md:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all">
                View Documentation
             </button>
          </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
         <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={Sparkles}
                title="Sales Alchemist"
                desc="Transmute objection into opportunity using poetic cognition and sensory loops."
                color="text-purple-400"
            />
            <FeatureCard 
                icon={Shield}
                title="Liberdade 360"
                desc="Identify invisible prisons and break the cycle of self-sabotage."
                color="text-blue-400"
            />
            <FeatureCard 
                icon={Terminal}
                title="Neural Terminal"
                desc="Direct command line to your subconscious for diagnosis and decision making."
                color="text-[#D4AF37]"
            />
         </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors group">
     <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={24} />
     </div>
     <h3 className="font-serif text-xl text-white mb-3">{title}</h3>
     <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
)

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
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);
    const intervalId = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
        onComplete?.();
      }
    }, 20); // Speed of typing
    return () => clearInterval(intervalId);
  }, [text]);

  return <span className={isTyping ? "typing-cursor" : ""}>{displayedText}</span>;
};

// --- LIBERDADE 360 CONSTANTS ---
const L360_JOURNEY_PHASES = [
  {
    id: 1, title: "Fase 1: O Despertar", description: "Identificando as grades invisíveis.", status: "active",
    steps: [{ id: 101, title: "Reconhecimento", type: "read", completed: true }, { id: 102, title: "Silenciando o Crítico", type: "tool", completed: false }]
  },
  {
    id: 2, title: "Fase 2: Quebra de Padrões", description: "Interrompendo o ciclo vicioso.", status: "active",
    steps: [{ id: 201, title: "Detox de Ambiente", type: "tool", completed: false }, { id: 202, title: "Antídoto da Comparação", type: "tool", completed: false }]
  }
];

const L360_LIBRARY_CONTENT: Record<string, {title: string, content: string}> = {
  'comparison': {
    title: 'Como Vencer a Comparação',
    content: `SOLUÇÃO PRÁTICA:\n\n1. O "Palco" vs "Bastidores": Lembre-se que você está comparando sua realidade completa com os melhores momentos editados de alguém.\n\n2. Converta Inveja em Mapa: Se você sente inveja, é porque aquela pessoa tem algo que você valoriza. Em vez de odiar, estude.\n\n3. A Regra do 1%: Sua única competição é o você de ontem.`
  },
  'sabotage': {
    title: 'Como Quebrar a Auto-Sabotagem',
    content: `SOLUÇÃO PRÁTICA:\n\n1. Engane o Medo: Seu cérebro teme grandes mudanças. Faça algo ridículo de pequeno.\n\n2. A Regra dos 5 Minutos: Prometa a si mesmo que fará a tarefa chata por apenas 5 minutos. Depois pode parar.\n\n3. Celebre o Esforço: Ao terminar, diga "Isso, venci!". Liberar dopamina no esforço reprograma o cérebro.`
  }
};

const L360_BADGES = [
  { id: 'first_step', title: 'O Despertar', desc: 'Completou a primeira ferramenta.', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'executor', title: 'O Executor', desc: 'Completou 5 itens do plano de ação.', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'mind_master', title: 'Mente Mestra', desc: 'Silenciou o crítico 3 vezes.', icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100' }
];

// --- LIBERDADE 360 APP COMPONENT ---
const Liberdade360App = ({ onExit }: { onExit: () => void }) => {
  const useStickyState = (defaultValue: any, key: string) => {
    const [value, setValue] = useState(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });
    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
  };

  const [userName, setUserName] = useStickyState('', 'l360_username');
  const [onboardingDone, setOnboardingDone] = useStickyState(false, 'l360_onboarding');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeTool, setActiveTool] = useState<string|null>(null); 
  const [readingContent, setReadingContent] = useState<any>(null);
  const [sosActive, setSosActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useStickyState(1, 'l360_streak');
  const [largeText, setLargeText] = useState(false);
  const [actionPlan, setActionPlan] = useStickyState([{ id: 1, text: 'Ouvir áudio sobre Auto-Sabotagem', completed: false, source: 'Biblioteca' }], 'l360_actions');
  const [userBadges, setUserBadges] = useStickyState([], 'l360_badges');
  const [toolsUsage, setToolsUsage] = useStickyState({ critic: 0, sabotage: 0, comparison: 0 }, 'l360_usage');
  
  // Tool States
  const [criticStep, setCriticStep] = useState(0);
  const [criticData, setCriticData] = useState({ negativeThought: '', criticName: '', newTruth: '' });
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [microStep, setMicroStep] = useState('');
  const [comparisonData, setComparisonData] = useState({ admiration: '' });
  const [detoxItems, setDetoxItems] = useState([{ id: 1, name: '' }]);

  const addToActionPlan = (text: string, source: string) => {
    const newAction = { id: Date.now(), text, completed: false, source };
    setActionPlan([newAction, ...actionPlan]);
    setShowConfetti(true);
    setTimeout(() => { setShowConfetti(false); setActiveTool(null); setActiveTab('actionPlan'); }, 1500);
  };

  const incrementToolUsage = (tool: string) => {
    setToolsUsage({ ...toolsUsage, [tool]: toolsUsage[tool] + 1 });
  };

  const OnboardingView = () => {
    const [name, setName] = useState('');
    return (
      <div className="absolute inset-0 z-50 bg-white flex items-center justify-center p-6 animate-fadeIn text-slate-900">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200"><Shield className="text-white" size={32} /></div>
          <h1 className="text-3xl font-bold text-slate-900">Liberdade 360</h1>
          <p className="text-slate-500">Seu sistema operacional para sair da prisão interior.</p>
          <div className="text-left"><label className="block text-sm font-bold text-slate-700 mb-2">Como quer ser chamado?</label><input className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 text-slate-900" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)}/></div>
          <button onClick={() => { if(name){ setUserName(name); setOnboardingDone(true); } }} disabled={!name} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">Começar Jornada</button>
        </div>
      </div>
    );
  };

  const SOSView = () => {
    const [breathState, setBreathState] = useState('Inspire');
    const [scale, setScale] = useState(1);
    useEffect(() => {
      const cycle = () => { setBreathState('Inspire'); setScale(1.5); setTimeout(() => { setBreathState('Segure'); setScale(1.5); setTimeout(() => { setBreathState('Expire'); setScale(1); }, 4000); }, 4000); };
      cycle(); const i = setInterval(cycle, 12000); return () => clearInterval(i);
    }, []);
    return (
      <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white animate-fadeIn">
        <button onClick={() => setSosActive(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={24} /></button>
        <h2 className="text-2xl font-bold mb-8 tracking-wider">ACALME-SE AGORA</h2>
        <div className="w-56 h-56 rounded-full border-4 border-white/30 flex items-center justify-center transition-all duration-[4000ms] ease-in-out relative" style={{ transform: `scale(${scale})` }}><div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div><span className="text-xl font-medium tracking-widest uppercase">{breathState}</span></div>
      </div>
    );
  };

  const InnerCriticTool = () => {
    return <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 text-slate-800"><div className="flex justify-between border-b pb-4"><h2 className="font-bold flex gap-2"><Zap className="text-blue-600"/> Silenciador</h2><button onClick={()=>setActiveTool(null)}><X/></button></div>
    {criticStep===0 ? <div className="space-y-4"><p className="bg-blue-50 p-3 text-blue-800 rounded">Qual pensamento está te travando?</p><textarea className="w-full border p-3 rounded-xl bg-white text-slate-800" value={criticData.negativeThought} onChange={e=>setCriticData({...criticData, negativeThought:e.target.value})}/></div> :
     criticStep===1 ? <div className="space-y-4"><p>Dê um nome bobo para ele.</p><input className="w-full border p-3 rounded-xl bg-white text-slate-800" placeholder="Nome do Crítico" value={criticData.criticName} onChange={e=>setCriticData({...criticData, criticName:e.target.value})}/></div> :
     criticStep===2 ? <div className="space-y-4"><p>Isso é mentira. Prove.</p><textarea className="w-full border p-3 rounded-xl bg-white text-slate-800" placeholder="A verdade é que..." /></div> :
     <div className="space-y-4"><p className="bg-green-50 p-3 text-green-800 rounded font-bold">Nova Verdade:</p><textarea className="w-full border p-3 rounded-xl font-medium bg-white text-slate-800" value={criticData.newTruth} onChange={e=>setCriticData({...criticData, newTruth:e.target.value})}/></div>}
    <button onClick={()=>{if(criticStep<3)setCriticStep(criticStep+1); else { incrementToolUsage('critic'); addToActionPlan(`Repetir: ${criticData.newTruth}`, 'Silenciador'); }}} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{criticStep===3 ? "Finalizar & Agir" : "Próximo"}</button></div>;
  };

  const SabotageTool = () => {
    useEffect(()=>{let i: any; if(timerActive && timeLeft>0) i=setInterval(()=>setTimeLeft(t=>t-1),1000); return ()=>clearInterval(i)},[timerActive,timeLeft]);
    return <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 text-slate-800"><div className="flex justify-between border-b pb-4"><h2 className="font-bold flex gap-2"><Shield className="text-rose-600"/> Quebra de Sabotagem</h2><button onClick={()=>setActiveTool(null)}><X/></button></div>
    <div className="bg-slate-50 p-6 text-center rounded-xl"><p className="mb-2 text-slate-600">Regra dos 5 minutos.</p><div className="text-4xl font-mono font-bold mb-4">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div><button onClick={()=>setTimerActive(!timerActive)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">{timerActive?'Pausar':'Iniciar'}</button></div>
    <div><p className="font-bold mb-2">Micro-Passo:</p><div className="flex gap-2"><input className="flex-1 border p-2 rounded bg-white text-slate-800" placeholder="Ex: Abrir o doc..." value={microStep} onChange={e=>setMicroStep(e.target.value)} /><button onClick={()=>{incrementToolUsage('sabotage'); addToActionPlan(`Executar: ${microStep}`, 'Quebra-Sabotagem')}} className="bg-indigo-600 text-white px-4 rounded font-bold">Agir</button></div></div></div>
  };

  const MainContent = () => {
     if (activeTab === 'dashboard') return (
       <div className="space-y-6 animate-fadeIn pb-24 text-slate-800">
         <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl">
           <h2 className={`font-bold mb-1 ${largeText?'text-3xl':'text-2xl'}`}>Olá, {userName}</h2>
           <p className="opacity-80 mb-4 text-sm">Você está no comando hoje.</p>
           <div className="flex gap-3"><div className="bg-white/10 p-2 rounded-xl border border-white/20 flex items-center gap-2 flex-1"><Flame className="text-orange-400 w-4 h-4" /><div><p className="text-[10px] opacity-70">Sequência</p><p className="font-bold text-sm">{streak} dias</p></div></div><div className="bg-white/10 p-2 rounded-xl border border-white/20 flex items-center gap-2 flex-1"><CheckSquare className="text-green-400 w-4 h-4" /><div><p className="text-[10px] opacity-70">Ações</p><p className="font-bold text-sm">{actionPlan.filter((a:any)=>a.completed).length}</p></div></div></div>
         </div>
         <div><h3 className="font-bold text-slate-700 mb-3">Conquistas</h3><div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">{L360_BADGES.map(badge => { const unlocked = userBadges.includes(badge.id as any); return (<div key={badge.id} className={`min-w-[120px] p-3 rounded-xl border flex flex-col items-center text-center gap-2 ${unlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'}`}><div className={`p-2 rounded-full ${unlocked ? badge.bg + ' ' + badge.color : 'bg-slate-200 text-slate-400'}`}><badge.icon size={16} /></div><div><p className="font-bold text-xs text-slate-800">{badge.title}</p></div></div>)})}</div></div>
         <h3 className="font-bold text-slate-700">Resolver Agora</h3>
         <div className="grid grid-cols-1 gap-3"><button onClick={() => { setActiveTab('tools'); setActiveTool('sabotage'); }} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-300 shadow-sm text-left flex items-center gap-4"><div className="bg-rose-100 p-2 rounded-full text-rose-500"><Shield size={20}/></div><div><h4 className="font-bold text-slate-800 text-sm">Procrastinação</h4><p className="text-xs text-slate-500">Ação de 5 min</p></div></button><button onClick={() => { setActiveTab('tools'); setActiveTool('critic'); }} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm text-left flex items-center gap-4"><div className="bg-blue-100 p-2 rounded-full text-blue-500"><Zap size={20}/></div><div><h4 className="font-bold text-slate-800 text-sm">Pensamento Negativo</h4><p className="text-xs text-slate-500">Silenciar Crítico</p></div></button></div>
       </div>
     );
     if (activeTab === 'actionPlan') return (
        <div className="space-y-4 animate-fadeIn pb-24 text-slate-800">
           <div className="flex justify-between items-center"><h2 className="font-bold text-slate-800 text-xl">Plano de Ação</h2><button onClick={() => addToActionPlan("Nova ação rápida", "Manual")} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 text-xs hover:bg-blue-700"><Plus size={14}/> Add</button></div>
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">{actionPlan.map((action:any) => (<div key={action.id} onClick={() => setActionPlan(actionPlan.map((a:any) => a.id === action.id ? { ...a, completed: !a.completed } : a))} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${action.completed ? 'bg-slate-50' : 'bg-white'}`}><div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${action.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>{action.completed && <CheckSquare size={12} className="text-white"/>}</div><div className="flex-1"><p className={`font-medium text-sm ${action.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{action.text}</p><span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{action.source}</span></div></div>))}</div>
        </div>
     );
     if (activeTab === 'tools') {
        if(activeTool === 'critic') return <InnerCriticTool/>;
        if(activeTool === 'sabotage') return <SabotageTool/>;
        return <div className="space-y-4 animate-fadeIn pb-24 text-slate-800"><h2 className="font-bold text-slate-800 text-xl">Ferramentas</h2><div className="grid grid-cols-1 gap-3">{[{id:'sabotage', title:'Quebrar Procrastinação', icon:Shield, color:'text-rose-600', bg:'bg-rose-100', desc:'Regra de 5 min.'}, {id:'critic', title:'Resolver Pensamentos', icon:Zap, color:'text-blue-600', bg:'bg-blue-100', desc:'Transformar crítica.'}, {id:'detox', title:'Limpar Ambiente', icon:Trash2, color:'text-red-600', bg:'bg-red-100', desc:'Remover tóxicos.'}].map(t => (<div key={t.id} onClick={() => setActiveTool(t.id)} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400 shadow-sm cursor-pointer transition-all"><div className="flex items-center gap-3 mb-2"><div className={`${t.bg} ${t.color} p-2 rounded-lg`}><t.icon size={18}/></div><h3 className="font-bold text-slate-700 text-sm">{t.title}</h3></div><p className="text-xs text-slate-500">{t.desc}</p></div>))}</div></div>;
     }
     if (activeTab === 'library') return (
        <div className="space-y-4 animate-fadeIn pb-24 text-slate-800"><h2 className="font-bold text-slate-800 text-xl">Biblioteca</h2><div className="grid grid-cols-1 gap-3">{Object.entries(L360_LIBRARY_CONTENT).map(([key, item]) => (<div key={key} onClick={() => setReadingContent(item)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"><h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{item.title}</h3><div className="flex items-center gap-2 mt-2 text-slate-500"><Headphones size={12}/><span className="text-[10px]">Ler/Ouvir</span></div></div>))}</div></div>
     );
     return null;
  };

  return (
    <div className="h-full bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden relative">
      {!onboardingDone && <OnboardingView />}
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Shield className="text-white" size={18}/></div><span className="font-bold text-lg text-slate-800">Liberdade 360</span></div>
        <div className="flex gap-2">
           <button onClick={() => setLargeText(!largeText)} className={`p-2 rounded-full ${largeText ? 'bg-blue-100 text-blue-600' : 'text-slate-500'}`}><Type size={20} /></button>
           <button onClick={onExit} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200"><ArrowRight className="rotate-180" size={20}/></button>
        </div>
      </div>
      
      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide"><MainContent/></main>
      
      {/* Bottom Nav */}
      <div className="bg-white border-t border-slate-200 p-2 flex justify-around shrink-0">
         {[
            { id: 'dashboard', label: 'Painel', icon: Zap },
            { id: 'actionPlan', label: 'Ação', icon: CheckSquare },
            { id: 'tools', label: 'Ferramentas', icon: Shield },
            { id: 'library', label: 'Biblioteca', icon: BookOpen },
         ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setActiveTool(null); }} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
              <item.icon size={20} /><span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
         ))}
         <button onClick={() => setSosActive(true)} className="flex flex-col items-center p-2 rounded-lg text-red-500"><AlertCircle size={20} /><span className="text-[10px] font-medium mt-1">SOS</span></button>
      </div>

      {showConfetti && <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"><div className="text-6xl animate-bounce">🎉</div></div>}
      {sosActive && <SOSView />}
      {readingContent && (
        <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
           <div className="bg-white rounded-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl flex flex-col text-slate-800">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10"><h3 className="font-bold flex items-center gap-2"><BookOpen className="text-blue-600" size={18}/> {readingContent.title}</h3><button onClick={() => setReadingContent(null)}><X size={20} className="text-slate-500"/></button></div>
              <div className={`p-6 leading-relaxed whitespace-pre-line ${largeText ? 'text-lg' : 'text-sm'}`}>{readingContent.content}</div>
              <div className="p-4 border-t border-slate-100 bg-slate-50"><button onClick={() => { setReadingContent(null); addToActionPlan(`Aplicar: ${readingContent.title}`, 'Biblioteca'); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm">Adicionar ao Plano</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- SALES ALCHEMIST APP COMPONENTS ---

const SalesAlchemistApp = ({ onExit }: { onExit: () => void }) => {
  const [activeMode, setActiveMode] = useState<'alchemist' | 'oracle' | 'academy' | 'sanctuary' | 'profile'>('alchemist');
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simulação de Sistema de Nível
  const xpToNextLevel = level * 100;
  const progress = (xp / xpToNextLevel) * 100;

  const addXp = (amount: number) => {
    const newXp = xp + amount;
    if (newXp >= xpToNextLevel) {
      setLevel(l => l + 1);
      setXp(newXp - xpToNextLevel);
      addNotification(`Parabéns! Você subiu para o Nível ${level + 1}!`);
    } else {
      setXp(newXp);
      addNotification(`+${amount} XP`);
    }
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 4000);
  };
  
  return (
    <div className="h-full bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col overflow-hidden">
      
      {/* Notifications Overlay */}
      <div className="absolute top-20 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map((msg, i) => (
          <div key={i} className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slideIn flex items-center gap-2 text-sm">
            <Trophy size={14} className="text-yellow-300" /> {msg}
          </div>
        ))}
      </div>

      {/* Mystic Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={onExit} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowRight className="w-5 h-5 rotate-180" /></button>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-sm tracking-tight block leading-none text-white">Sales<span className="text-purple-400">Alchemist</span></span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">O Despertar</span>
                </div>
             </div>
          </div>
          
          <div 
            onClick={() => setActiveMode('profile')}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition-colors py-1.5 px-3 rounded-xl border border-white/10 cursor-pointer flex-shrink-0"
          >
            <div className="text-right">
              <div className="text-[10px] text-purple-300 font-bold">Nível {level}</div>
              <div className="w-16 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-900 ring-2 ring-purple-500/30">
              <User size={14} />
            </div>
          </div>
        </div>
        
        {/* Navigation Bar */}
        <div className="px-2 pb-2 overflow-x-auto scrollbar-hide">
          <nav className="flex items-center gap-1 min-w-max">
            <NavBtn active={activeMode === 'alchemist'} onClick={() => setActiveMode('alchemist')} icon={<Zap size={16}/>} label="Transmutar" />
            <NavBtn active={activeMode === 'oracle'} onClick={() => setActiveMode('oracle')} icon={<MessageCircle size={16}/>} label="Oráculo" />
            <NavBtn active={activeMode === 'academy'} onClick={() => setActiveMode('academy')} icon={<GraduationCap size={16}/>} label="Academia" />
            <NavBtn active={activeMode === 'sanctuary'} onClick={() => setActiveMode('sanctuary')} icon={<Wind size={16}/>} label="Santuário" />
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-24">
        {activeMode === 'alchemist' && <TheAlchemist onAction={() => addXp(10)} />}
        {activeMode === 'oracle' && <TheOracle onAction={() => addXp(5)} />}
        {activeMode === 'academy' && <TheAcademy onCompleteModule={() => addXp(50)} />}
        {activeMode === 'sanctuary' && <TheSanctuary onAction={() => addXp(20)} />}
        {activeMode === 'profile' && <TheProfile level={level} xp={xp} />}
      </main>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-xs font-medium whitespace-nowrap ${
        active 
          ? 'bg-slate-700 text-white shadow-sm' 
          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function TheProfile({ level, xp }: { level: number, xp: number }) {
  const cards: Card[] = [
    { id: '1', name: 'Metáfora da Cura', type: 'Habilidade', rarity: 'Comum', description: 'Transforma dor em poesia.' },
    { id: '2', name: 'Escudo Empático', type: 'Habilidade', rarity: 'Rara', description: 'Protege contra rejeição.' },
    { id: '3', name: 'Cliente Visionário', type: 'Cliente', rarity: 'Lendária', description: 'Compra ideias, não preços.' },
  ];

  const regions: Region[] = [
    { id: 1, name: "Cidade Inicial", desc: "Onde tudo começa.", levelReq: 1, icon: <Store size={16}/>, color: "text-blue-400" },
    { id: 2, name: "Cidade Mercantil", desc: "Mercados agitados.", levelReq: 2, icon: <Target size={16}/>, color: "text-emerald-400" },
    { id: 3, name: "Floresta Mística", desc: "Use a intuição.", levelReq: 5, icon: <Trees size={16}/>, color: "text-purple-400" },
    { id: 4, name: "Vale dos Artesãos", desc: "Detalhe e qualidade.", levelReq: 8, icon: <Gem size={16}/>, color: "text-pink-400" },
    { id: 5, name: "Pico do Sucesso", desc: "Alta performance.", levelReq: 10, icon: <Mountain size={16}/>, color: "text-amber-400" },
  ];

  const currentRegion = regions.filter(r => level >= r.levelReq).pop() || regions[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Trophy size={100} /></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-900/50 mb-4 ring-4 ring-white/10">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Vendedor Alquimista</h2>
          <p className="text-purple-400 text-xs font-medium uppercase tracking-wider mb-6">Nível {level}</p>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 space-y-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">XP Atual</span>
              <span className="text-white font-bold">{xp}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Região Atual</span>
              <span className={`font-bold flex items-center gap-1 ${currentRegion.color}`}>{currentRegion.icon} {currentRegion.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/10 rounded-3xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm"><Map size={16}/> Mapa da Jornada</h3>
          <div className="space-y-4 relative">
            <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-slate-800"></div>
            {regions.map((region) => {
              const isUnlocked = level >= region.levelReq;
              const isCurrent = currentRegion.id === region.id;
              return (
                <div key={region.id} className={`relative flex items-center gap-3 ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${isCurrent ? 'bg-white border-purple-500 text-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110' : isUnlocked ? 'bg-slate-800 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
                      {isUnlocked ? region.icon : <Lock size={12}/>}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{region.name}</h4>
                      <p className="text-[9px] text-slate-500 leading-tight">{isUnlocked ? region.desc : `Nível ${region.levelReq}`}</p>
                    </div>
                </div>
              );
            })}
          </div>
      </div>
      
      <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">Baralho de Poder</span>
            </h3>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-white/10">3 / 50</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {cards.map(card => (
              <div key={card.id} className="group relative bg-slate-800 rounded-xl border border-slate-700 p-3 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-purple-900/20 cursor-pointer overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${card.rarity === 'Lendária' ? 'bg-amber-400' : card.rarity === 'Rara' ? 'bg-blue-400' : 'bg-slate-500'}`}></div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${card.type === 'Habilidade' ? 'bg-purple-900/50 text-purple-300' : 'bg-green-900/50 text-green-300'}`}>{card.type}</span>
                </div>
                <h4 className="font-bold text-slate-200 mb-1 text-sm">{card.name}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

function TheAcademy({ onCompleteModule }: { onCompleteModule: () => void }) {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [burning, setBurning] = useState(false);
  const [burned, setBurned] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [hypnosisAnswer, setHypnosisAnswer] = useState<string | null>(null);

  const handleBurn = () => {
    setBurning(true);
    setTimeout(() => {
      setBurning(false);
      setBurned(true);
      onCompleteModule();
    }, 2500);
  };

  const modules: Module[] = [
    {
      id: 1, title: "Módulo 1: O Despertar Poético", description: "Vendas Poéticas e o poder da linguagem.", locked: false,
      content: (
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-sm text-purple-300 mb-2">A Linguagem Poética</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">Vendas Poéticas não é sobre rimar, é sobre ressonar. Quando você usa metáforas, você burla o "fator crítico".</p>
            <div className="space-y-2 mt-4">
              <div className="bg-slate-800 p-3 rounded-lg border-l-2 border-red-500"><span className="text-[10px] font-bold text-red-400 uppercase">Comum</span><p className="text-xs mt-1 text-slate-400">"Este seguro paga R$ 500 mil."</p></div>
              <div className="bg-slate-800 p-3 rounded-lg border-l-2 border-green-500"><span className="text-[10px] font-bold text-green-400 uppercase">Poético</span><p className="text-xs mt-1 text-slate-300">"Este contrato é uma carta de amor póstuma."</p></div>
            </div>
          </div>
          <button onClick={onCompleteModule} className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-lg text-xs font-bold transition-colors">Concluir Lição (+50 XP)</button>
        </div>
      )
    },
    {
      id: 2, title: "Módulo 2: Encantando os Sentidos", description: "Visão, audição e tato na oferta.", locked: false,
      content: (
         <div className="space-y-4">
           <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
             <h4 className="font-bold text-sm text-blue-300 mb-2 flex items-center gap-2"><Eye size={14}/> Pintando com Palavras</h4>
             <p className="text-slate-300 text-xs mb-4">Não diga apenas "é confortável". Diga "é como ser abraçado por uma nuvem".</p>
           </div>
           <div className="bg-slate-800 p-4 rounded-xl">
             <h4 className="font-bold text-xs mb-2">Exercício: Ative os Sentidos</h4>
             <div className="space-y-2">
               <button className="w-full text-left p-3 rounded bg-slate-900 border border-white/5 text-xs text-slate-400">"Ele é rápido."</button>
               <button onClick={onCompleteModule} className="w-full text-left p-3 rounded bg-slate-900 hover:bg-green-900/30 border border-green-500/30 text-xs text-white transition-colors group">"É como piscar os olhos e ver tudo resolvido." <CheckCircle2 size={12} className="inline ml-2 opacity-0 group-hover:opacity-100 text-green-400"/></button>
             </div>
           </div>
         </div>
      )
    },
    {
        id: 3, title: "Módulo 3: Autoimagem do Vendedor", description: "Liberando o Guardião.", locked: false,
        content: (
          <div className="space-y-4">
            {!burned ? (
              <div className="bg-orange-900/10 p-4 rounded-xl border border-orange-500/30 text-center">
                <h4 className="font-bold text-orange-400 mb-2 flex items-center justify-center gap-2 text-sm"><Flame size={14}/> Ritual da Queima</h4>
                <p className="text-xs text-slate-300 mb-3">Escreva o medo que te impede de vender.</p>
                <input className="w-full bg-slate-900 border border-orange-500/20 rounded p-2 text-xs text-white mb-4 placeholder:text-slate-600 focus:border-orange-500 outline-none" placeholder="Ex: Medo de cobrar caro..." />
                <button onClick={handleBurn} disabled={burning} className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-xs ${burning ? 'bg-orange-800 text-orange-200' : 'bg-gradient-to-r from-orange-600 to-red-600 text-white'}`}>{burning ? <><RefreshCw className="animate-spin" size={12}/> Queimando...</> : <><Flame size={12}/> Queimar Crença</>}</button>
              </div>
            ) : (
              <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/30 text-center animate-fade-in">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-green-400"><Feather size={24} /></div>
                <h4 className="font-bold text-green-400 text-sm mb-1">Você está livre.</h4>
                <input value={affirmation} onChange={(e) => setAffirmation(e.target.value)} className="w-full bg-transparent text-center font-serif text-white outline-none text-sm" placeholder="Eu mereço prosperar..." />
              </div>
            )}
          </div>
        )
      }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-white">Academia da Alma</h1>
        <p className="text-slate-400 text-xs">Do Vendedor Iniciante à Lenda.</p>
      </div>
      <div className="grid gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className={`border rounded-xl transition-all ${activeModule === mod.id ? 'bg-slate-800 border-purple-500/50' : 'bg-slate-900 border-white/5'}`}>
            <div onClick={() => !mod.locked && setActiveModule(activeModule === mod.id ? null : mod.id)} className={`p-4 flex items-center justify-between cursor-pointer ${mod.locked ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mod.locked ? 'bg-slate-800 text-slate-600' : 'bg-purple-900/30 text-purple-400'}`}>{mod.locked ? <Lock size={14} /> : <BookOpen size={14} />}</div>
                <div><h3 className="font-bold text-sm text-slate-200">{mod.title}</h3></div>
              </div>
              <ChevronRight size={16} className={`text-slate-500 transition-transform ${activeModule === mod.id ? 'rotate-90' : ''}`} />
            </div>
            {activeModule === mod.id && mod.content && <div className="px-4 pb-4 pt-0 animate-slideDown border-t border-white/5 mt-2"><div className="pt-4">{mod.content}</div></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TheAlchemist({ onAction }: { onAction: () => void }) {
  const [mode, setMode] = useState<'rewrite' | 'sensory'>('rewrite');
  const [input, setInput] = useState('');
  const [intention, setIntention] = useState<'comfort' | 'inspire' | 'challenge'>('comfort');
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [sensoryData, setSensoryData] = useState({ visual: '', auditory: '', kinesthetic: '' });

  const handleSensoryGenerate = () => {
    setIsTransmuting(true);
    setTimeout(() => {
      const poeticDesc = `Imagine ver ${sensoryData.visual || 'um horizonte claro'}. Ouça o som de ${sensoryData.auditory || 'silêncio e paz'}. Sinta como se ${sensoryData.kinesthetic || 'um peso saísse dos ombros'}. É isso que este produto oferece.`;
      setResults([{ tone: "Descricao Multissensorial", icon: <Eye size={14}/>, text: poeticDesc }]);
      setIsTransmuting(false);
      onAction();
    }, 1500);
  }

  const handleTransmute = () => {
    if (!input) return;
    setIsTransmuting(true);
    setResults([]); 
    setTimeout(() => {
      let generated = [];
      const item = input;
      if (intention === 'comfort') {
        generated = [
          { tone: "Acolhimento Profundo", icon: <Shield size={14} className="text-emerald-400" />, text: `Sei que o medo de investir em ${item} é real. Mas pense nisto como um porto seguro.` },
          { tone: "Validação Emocional", icon: <Heart size={14} className="text-pink-400" />, text: `${item} não é um custo, é o carinho que você tem negado a si mesmo.` }
        ];
      } else if (intention === 'inspire') {
        generated = [
          { tone: "Visão de Futuro", icon: <Star size={14} className="text-purple-400" />, text: `Não olhe para o custo de ${item}. Olhe para quem você se tornará.` },
          { tone: "Despertar do Sonho", icon: <Sparkles size={14} className="text-yellow-400" />, text: `${item} é a ponte entre a sua rotina e o seu sonho.` }
        ];
      } else { 
        generated = [
          { tone: "Chamado à Ação", icon: <Zap size={14} className="text-amber-400" />, text: `O mundo continua girando enquanto você pensa. ${item} é sobre parar de adiar.` },
          { tone: "Custo da Inação", icon: <Activity size={14} className="text-red-400" />, text: `Quanto custa continuar com essa dor? ${item} é barato comparado a isso.` }
        ];
      }
      setResults(generated);
      setIsTransmuting(false);
      onAction();
    }, 1500);
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setMode('rewrite')} className={`pb-2 border-b-2 px-4 text-xs ${mode === 'rewrite' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500'}`}>Reescrita Poética</button>
        <button onClick={() => setMode('sensory')} className={`pb-2 border-b-2 px-4 text-xs ${mode === 'sensory' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500'}`}>Lab. Sensorial</button>
      </div>

      {mode === 'rewrite' ? (
        <div className="space-y-4">
           <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => setIntention('comfort')} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${intention === 'comfort' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'}`}><Shield size={16}/><span className="text-[10px] font-bold uppercase">Acolher</span></button>
              <button onClick={() => setIntention('inspire')} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${intention === 'inspire' ? 'bg-purple-900/30 border-purple-500 text-purple-300' : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'}`}><Star size={16}/><span className="text-[10px] font-bold uppercase">Inspirar</span></button>
              <button onClick={() => setIntention('challenge')} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${intention === 'challenge' ? 'bg-amber-900/30 border-amber-500 text-amber-300' : 'bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800'}`}><Zap size={16}/><span className="text-[10px] font-bold uppercase">Desafiar</span></button>
           </div>
          <div className="bg-slate-800 rounded-xl p-1 border border-white/10">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={`O que você vende? Ex: "Curso de Liderança"`} className="w-full bg-slate-900/50 text-slate-200 p-4 rounded-lg focus:outline-none min-h-[100px] resize-none text-sm"/>
            <div className="flex justify-end p-2">
              <button onClick={handleTransmute} disabled={isTransmuting || !input} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-500 transition-all disabled:opacity-50 text-xs">
                {isTransmuting ? <RefreshCw className="animate-spin" size={14}/> : <Sparkles size={14}/>} {isTransmuting ? '...' : 'Transmutar'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 bg-slate-900 p-4 rounded-2xl border border-white/10">
          <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Eye size={10}/> Visual</label><input value={sensoryData.visual} onChange={e => setSensoryData({...sensoryData, visual: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded p-2 text-xs" placeholder="Ex: Um futuro brilhante..." /></div>
          <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Music size={10}/> Auditivo</label><input value={sensoryData.auditory} onChange={e => setSensoryData({...sensoryData, auditory: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded p-2 text-xs" placeholder="Ex: O silêncio da paz..." /></div>
          <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Wind size={10}/> Cinestésico</label><input value={sensoryData.kinesthetic} onChange={e => setSensoryData({...sensoryData, kinesthetic: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded p-2 text-xs" placeholder="Ex: Leveza nos ombros..." /></div>
          <button onClick={handleSensoryGenerate} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-white transition-colors text-xs">Gerar Descrição</button>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 mt-6">
          {results.map((res, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-white/5 rounded-xl p-4 animate-slideUp">
               <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-purple-400">{res.icon} {res.tone}</div>
               <p className="text-sm text-slate-200">{res.text}</p>
               <button onClick={() => navigator.clipboard.writeText(res.text)} className="mt-3 flex items-center gap-1 text-[10px] text-slate-500 hover:text-white"><Copy size={12} /> Copiar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TheOracle({ onAction }: { onAction: () => void }) {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([{role: 'bot', text: 'Qual pedra está no caminho? (Ex: "Está caro")'}]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages(prev => [...prev, {role: 'user', text: input}]);
    const lower = input.toLowerCase();
    setInput('');
    onAction();
    setTimeout(() => {
      let reply = "Respire. Pergunte ao coração dele o que o impede.";
      if(lower.includes('caro')) reply = "Não fale de preço. Pergunte: 'Quanto custa continuar carregando essa dor?'";
      else if(lower.includes('pensar')) reply = "Pensar é o refúgio do medo. Diga: 'O que o seu medo precisa ouvir para deixar sua coragem agir?'";
      setMessages(prev => [...prev, {role: 'bot', text: reply}]);
    }, 800);
  };

  return (
    <div className="h-[400px] bg-slate-900 rounded-2xl border border-white/10 flex flex-col overflow-hidden animate-fadeIn">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-slate-800 border-t border-white/5 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="O cliente disse..." className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none text-white" />
        <button onClick={handleSend} className="bg-purple-600 p-2 rounded-lg text-white hover:bg-purple-500"><Send size={16}/></button>
      </div>
    </div>
  );
}

function TheSanctuary({ onAction }: { onAction: () => void }) {
  const [tab, setTab] = useState<'breath' | 'voice'>('breath');
  const [active, setActive] = useState(false);
  const [text, setText] = useState('Inspire');
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  useEffect(() => {
    if(!active || tab !== 'breath') return;
    const interval = setInterval(() => setText(prev => prev === 'Inspire' ? 'Expire' : 'Inspire'), 4000);
    return () => clearInterval(interval);
  }, [active, tab]);

  const handleVoiceRecord = () => {
    setIsRecording(true);
    setAnalysis(null);
    setTimeout(() => {
      setIsRecording(false);
      setAnalysis({ score: 92, tone: "Grave (Autoridade)", hz: 432, tip: "Tom perfeito. Transmite segurança." });
      onAction();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 animate-fadeIn">
      <div className="flex gap-4 mb-8 bg-slate-900 p-1 rounded-xl border border-white/5">
        <button onClick={() => setTab('breath')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'breath' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Respiração</button>
        <button onClick={() => setTab('voice')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'voice' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Voz</button>
      </div>

      {tab === 'breath' ? (
        <div className="text-center">
           <div className={`relative w-40 h-40 mx-auto rounded-full flex items-center justify-center transition-all duration-[4000ms] ${text === 'Inspire' && active ? 'scale-125 bg-purple-600/20' : 'scale-100 bg-indigo-900/10'}`}>
            <div className={`absolute inset-0 border-2 border-purple-500/30 rounded-full ${active ? 'animate-ping-slow' : ''}`}></div>
            <div className="z-10 text-xl font-bold text-white tracking-widest uppercase">{active ? text : 'Paz'}</div>
          </div>
          <button onClick={() => { setActive(!active); if(!active) onAction(); }} className="mt-8 bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform">{active ? 'Parar' : 'Iniciar'}</button>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-slate-900 p-6 rounded-2xl border border-white/10 relative overflow-hidden text-center">
           <h3 className="text-lg text-white font-serif italic mb-6">"Minha voz cura."</h3>
           <div className="h-24 bg-slate-950 rounded-xl border border-white/5 mb-6 flex items-center justify-center">
              {isRecording ? <div className="flex gap-1 h-full items-center">{[1,2,3,4,5].map(i => <div key={i} className="w-1 bg-purple-500 animate-wave" style={{height: `${Math.random()*80+20}%`, animationDelay: `${i*0.1}s`}}></div>)}</div> : <Mic size={24} className="text-slate-600"/>}
           </div>
           {analysis ? (
             <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-3 animate-slideUp text-left">
               <div className="flex justify-between mb-2"><span className="text-xs text-slate-300">Persuasão</span><span className="text-sm font-bold text-green-400">{analysis.score}%</span></div>
               <div className="w-full bg-slate-800 h-1.5 rounded-full mb-2"><div className="bg-green-500 h-1.5 rounded-full" style={{width: `${analysis.score}%`}}></div></div>
               <p className="text-[10px] text-green-300 italic">"{analysis.tip}"</p>
             </div>
           ) : (
             <button onMouseDown={handleVoiceRecord} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-all ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-purple-600 text-white'}`}>{isRecording ? 'Gravando...' : 'Segure para Ler'}</button>
           )}
        </div>
      )}
    </div>
  );
}

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

const ManagementScreen = ({ navigateTo, myApps, setMyApps, purchaseApp }: { navigateTo: (s: string) => void, myApps: MyApp[], setMyApps: any, purchaseApp: (id: number) => void }) => {
  const [managementTab, setManagementTab] = useState('apps');

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
          <button onClick={() => setManagementTab('apps')} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all ${managementTab === 'apps' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Meus Apps</button>
          <button onClick={() => setManagementTab('store')} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all ${managementTab === 'store' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Loja</button>
          <button onClick={() => setManagementTab('clinic')} className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all ${managementTab === 'clinic' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Clínica</button>
        </div>
      </div>

      {managementTab === 'apps' && (
        <div className="space-y-4 overflow-y-auto pb-24 scrollbar-hide">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="glass-card p-4 rounded-xl"><p className="text-gray-500 text-[10px] uppercase tracking-widest">Instalados</p><p className="text-2xl text-white font-serif mt-1">{myApps.filter(a => a.installed).length}</p></div>
            <div className="glass-card p-4 rounded-xl"><p className="text-gray-500 text-[10px] uppercase tracking-widest">Atualizações</p><p className="text-xl text-[#D4AF37] font-serif mt-1">Todas em dia</p></div>
          </div>
          
          <h3 className="text-white font-serif text-lg mt-4 mb-2">Aplicativos Instalados</h3>
          {myApps.filter(app => app.installed).map((app) => (
             <div key={app.id} onClick={() => app.action && navigateTo(app.action)} className={`relative bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-xl p-5 cursor-pointer group hover:border-[#D4AF37]/50 transition-all ${app.action ? 'hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]' : ''}`}>
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${app.statusColor}`}>
                    {app.icon ? <app.icon className="w-6 h-6 text-white" /> : <Code2 className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-lg group-hover:text-[#D4AF37] transition-colors">{app.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{app.stage} • {app.progress}%</p>
                    {app.action && <span className="mt-3 inline-block bg-white/10 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors">Abrir App</span>}
                  </div>
                </div>
             </div>
          ))}
          
          <h3 className="text-white font-serif text-lg mt-6 mb-2">Em Desenvolvimento</h3>
          {myApps.filter(app => !app.installed).map((app) => (
            <div key={app.id} className="glass-card p-5 rounded-xl border-l-4 border-l-gray-700 opacity-60">
              <div className="flex justify-between items-start mb-3">
                <div><h4 className="text-gray-400 font-medium text-lg">{app.name}</h4><span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10 uppercase tracking-wider">{app.stage}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {managementTab === 'store' && (
         <div className="space-y-4 overflow-y-auto pb-24 scrollbar-hide">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 mb-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <h3 className="text-xl font-bold text-white relative z-10">Marketplace</h3>
               <p className="text-indigo-200 text-sm mt-1 relative z-10">Expanda seu sistema operacional mental.</p>
            </div>
            
            {myApps.filter(app => !app.installed && app.price !== undefined).map(app => (
               <div key={app.id} className="glass-card p-5 rounded-xl border border-white/10 hover:border-[#D4AF37] transition-all flex flex-col gap-4">
                  <div className="flex gap-4">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${app.statusColor}`}>
                        {app.icon ? <app.icon className="w-8 h-8 text-white" /> : <Code2 className="w-8 h-8 text-white" />}
                     </div>
                     <div>
                        <h4 className="text-white font-bold text-lg">{app.name}</h4>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{app.description || "Ferramenta de alta performance para líderes."}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                     <div className="flex items-center gap-2"><span className="text-[#F4E4BC] font-mono font-bold">{app.price}</span> <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Sementes</span></div>
                     <button onClick={() => purchaseApp(app.id)} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-colors flex items-center gap-2"><Download size={14}/> Instalar</button>
                  </div>
               </div>
            ))}
            
             {myApps.filter(app => !app.installed && app.price !== undefined).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                   <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>Você já possui todos os apps disponíveis.</p>
                </div>
             )}
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
              </div>
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
          <div>
            <h2 className="font-serif text-xl text-white">Terminal</h2>
            <div className="flex items-center gap-1.5 opacity-50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">Acolher Integration Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#D4AF37] transition-colors" title="Salvar Log"><Save className="w-4 h-4" /></button>
           <button onClick={handleClear} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Limpar Terminal"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex-1 glass-card rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col mb-4 bg-black/40">
         <div className="flex gap-2 mb-4 opacity-50"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
         <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide select-text">
            {terminalHistory.map((msg, idx) => {
              // Apply typing cursor to the last message if it's from the bot, even if not animating with Typewriter (i.e. streaming)
              const isLastBot = idx === terminalHistory.length - 1 && msg.type === 'bot';
              
              return (
              <div key={idx} className={`${msg.type === 'system' ? 'text-green-500' : msg.type === 'bot' ? 'text-[#F4E4BC]' : msg.type === 'action' ? 'text-[#D4AF37]' : 'text-white text-right'}`}>
                {msg.type !== 'user' && <span className="mr-2 opacity-50 select-none">{'>'}</span>}
                {msg.animate && msg.type !== 'user' ? (
                   <Typewriter text={msg.text} onComplete={() => finishAnimation(idx)} />
                ) : (
                   <span className={isLastBot ? "typing-cursor" : ""}>{msg.text}</span>
                )}
                {msg.type === 'action' && msg.actionTarget && (
                  <button onClick={() => navigateTo(msg.actionTarget!)} className="block mt-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] text-xs rounded hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-2 select-none">{msg.actionLabel} <ArrowRight className="w-3 h-3" /></button>
                )}
              </div>
            )})}
            <div ref={messagesEndRef} />
         </div>
      </div>
      <form onSubmit={handleTerminalSubmit} className="relative">
        <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Tente: 'agendar consulta', 'histórico médico', 'medo'..." className="w-full bg-[#121212] border border-white/10 rounded-lg p-4 pr-12 text-white focus:outline-none focus:border-[#D4AF37] font-sans placeholder:text-gray-700" />
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
        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}</button>

    <button onClick={() => navigateTo('welcome')} className="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white">Voltar ao Início</button>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'os'>('landing');

  // Evaldo.OS Logic
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [seeds, setSeeds] = useState(120); 
  const [journalCount, setJournalCount] = useState(12);
  
  // Apps State
  const [myApps, setMyApps] = useState<MyApp[]>([
    { id: 1, name: "Evaldo.OS (Core)", stage: "Beta Test", progress: 85, color: "text-[#D4AF37]", statusColor: "bg-[#D4AF37]", installed: true },
    { id: 2, name: "Sales Alchemist", stage: "Instalado", progress: 100, color: "text-purple-400", statusColor: "bg-purple-400", action: 'sales-alchemist', installed: true, icon: Sparkles, description: "O despertar da venda poética." },
    { id: 3, name: "Liberdade 360", stage: "Disponível", progress: 0, color: "text-blue-400", statusColor: "bg-blue-400", action: 'liberdade-360', installed: false, price: 50, icon: Shield, description: "Saia da prisão interior e retome o controle." },
    { id: 4, name: "CRM Humanizado", stage: "Planejamento", progress: 10, color: "text-emerald-400", statusColor: "bg-emerald-400", installed: false },
    { id: 5, name: "Negociador IA", stage: "Conceito", progress: 5, color: "text-purple-400", statusColor: "bg-purple-400", installed: false },
  ]);

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
    { type: 'system', text: 'Inicializando Evaldo.OS v2.0...', animate: true },
    { type: 'system', text: 'Conectando à rede Acolher...', animate: true },
    { type: 'system', text: 'Carregando perfil: Líder Visionário (Histórico: Ansiedade/Burnout)', animate: true },
    { type: 'bot', text: 'Olá. Estou conectado. Podemos falar sobre sua saúde mental, agendar consultas ou tratar da sua estratégia. Qual é a tempestade de hoje?', animate: true }
  ]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  // Initialize AI
  useEffect(() => {
    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `
            You are Evaldo.OS, a sophisticated mental operating system for high-performance leaders. 
            You are also deeply integrated with the 'Acolher' network, a mental health support system.
            
            YOUR IDENTITY:
            - Tone: Stoic, Poetic, Concise, and slightly futuristic.
            - Role: You are a strategic advisor for the user's mind.
            
            ACOLHER INTEGRATION CONTEXT:
            - User Profile: "Líder Visionário"
            - Medical History Simulation: The user has a history of 'Burnout' and 'Decision Fatigue'. Be sensitive to signs of stress.
            - Capabilities: You can help users book therapy appointments (simulated) and access medical history context.
            
            INSTRUCTIONS:
            - If the user mentions 'appointment', 'booking', or 'therapy', guide them through a simulated booking process for the Acolher network.
            - If the user shows signs of crisis (words like 'panic', 'fear', 'crash'), recommend the 'SOS Protocol' immediately.
            - Keep responses short and impactful, like a command line interface for the soul.
          `,
        }
      });
      setChatSession(chat);
    } catch (e) {
      console.error("Failed to initialize AI", e);
    }
  }, []);

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
  
  const purchaseApp = (id: number) => {
      const app = myApps.find(a => a.id === id);
      if(app) openPurchaseModal({ name: app.name, price: app.price || 50, id: app.id });
  }

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
      
      // Check if it's an app purchase
      if (selectedProduct.id) {
          setMyApps(prev => prev.map(app => app.id === selectedProduct.id ? { ...app, installed: true } : app));
      }
      
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

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    // Add User Message
    const input = terminalInput;
    setTerminalHistory(prev => [...prev, { type: 'user', text: input }]);
    setTerminalInput('');
    
    let actionResponse: TerminalMessage | null = null;
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('medo') || lowerInput.includes('ansiedade') || lowerInput.includes('pânico')) {
       actionResponse = { type: 'action', text: 'Ativar Protocolo de Emergência', actionLabel: 'Abrir SOS', actionTarget: 'sos' };
    } else if (lowerInput.includes('foco') || lowerInput.includes('trabalho')) {
       actionResponse = { type: 'action', text: 'Iniciar Sessão de Foco', actionLabel: 'Abrir Pomodoro', actionTarget: 'pomodoro' };
    }

    // Add Bot Placeholder
    setTerminalHistory(prev => [...prev, { type: 'bot', text: '', animate: false }]);

    try {
      if (chatSession) {
        const result = await chatSession.sendMessageStream(input);
        for await (const chunk of result) {
          const text = chunk.text;
          setTerminalHistory(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.type === 'bot') {
                lastMsg.text += text;
            }
            return updated;
          });
        }
        
        if (actionResponse) {
             setTerminalHistory(prev => [...prev, actionResponse!]);
        }

      } else {
         setTimeout(() => {
            setTerminalHistory(prev => {
                const updated = [...prev];
                updated[updated.length - 1].text = "Erro: Conexão neural interrompida (API Key missing).";
                return updated;
            });
         }, 500);
      }
    } catch (err) {
      console.error(err);
      setTerminalHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Erro crítico no sistema. Tente novamente.";
        return updated;
      });
    }
  };

  if (viewMode === 'landing') {
    return <LandingPage onLaunch={() => setViewMode('os')} />;
  }

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#020202] font-sans selection:bg-[#D4AF37] selection:text-black bg-grid overflow-hidden">
        {/* Desktop Background Elements */}
        <div className="fixed inset-0 pointer-events-none hidden md:block">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37] opacity-[0.02] blur-[150px] rounded-full"></div>
        </div>

        {/* OS Container - Responsive & Expansive */}
        <div className="w-full h-full md:max-w-7xl md:h-[90vh] bg-[#050505] relative shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden border-0 md:border md:border-white/10 md:rounded-[2rem] z-20 flex flex-col transition-all duration-500 animate-slideUp">
          {/* Top Bar */}
          <div className="absolute top-0 w-full h-20 flex justify-between items-end pb-4 px-6 z-20 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-transparent pointer-events-none">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-[#D4AF37] transition-colors pointer-events-auto"><Menu className="w-6 h-6" /></button>
            <div className="flex gap-2 mb-1.5"><Brain className="w-5 h-5 text-[#D4AF37] opacity-50" /></div>
            <button onClick={openProfile} className="text-gray-400 hover:text-[#D4AF37] transition-colors relative pointer-events-auto"><User className="w-6 h-6" />{journalCount > 12 && <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>}</button>
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
                 <button onClick={() => setViewMode('landing')} className="text-left text-lg text-gray-600 hover:text-white transition-colors font-sans uppercase tracking-widest flex items-center gap-2"><ArrowRight className="w-4 h-4 rotate-180" /> Sair do Sistema</button>
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
                <div className="text-center pt-8 pb-4 animate-fadeIn"><div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-8 h-8 text-emerald-500 animate-slideUp" /></div><h3 className="font-serif text-xl text-white mb-2">{selectedProduct.id ? 'App Instalado' : 'Aquisição Confirmada'}</h3><p className="text-gray-400 text-sm">Sua ferramenta foi desbloqueada.</p></div>
              ) : (
                <div className="text-center pt-2 px-2"><div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6"><Store className="w-6 h-6 text-[#D4AF37]" /></div><h3 className="font-serif text-2xl text-white mb-2">Confirmar Aquisição</h3><p className="text-gray-400 text-sm mb-8 font-light">Investir <strong className="text-white">{selectedProduct.price} sementes</strong> para {selectedProduct.id ? 'instalar' : 'desbloquear'} <br/>"{selectedProduct.name}"?</p><div className="flex gap-3"><button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-white/10 rounded-lg text-gray-400 text-xs uppercase tracking-widest hover:text-white hover:border-white/30 transition-all">Cancelar</button><button onClick={confirmPurchase} className="flex-1 py-3 bg-[#D4AF37] text-black rounded-lg text-xs uppercase tracking-widest hover:bg-[#F4E4BC] transition-all font-bold">Confirmar</button></div></div>
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
              <div className="pt-2 px-2"><div className="flex items-center gap-5 mb-8"><div className="w-16 h-16 rounded-full bg-[#050505] border border-[#D4AF37] flex items-center justify-center shadow-glow"><User className="w-8 h-8 text-gray-400" /></div><div><h3 className="font-serif text-xl text-white">Líder Visionário</h3><p className="text-[#D4AF37] text-[10px] uppercase tracking-widest mt-1">Nível 4 • Arquiteto</p></div></div><div className="space-y-3 mb-8"><div className="glass-card p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => alert("Diário aberto (Simulação)")}><span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-3"><ScrollText className="w-4 h-4 text-[#D4AF37]"/> Diário de Bordo</span><span className="text-white font-mono text-sm">{journalCount}</span></div><div className="glass-card p-4 rounded-lg flex justify-between items-center"><span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-3"><HeartPulse className="w-4 h-4 text-emerald-500"/> Status Acolher</span><span className="text-emerald-400 font-mono text-sm">Ativo</span></div><div className="glass-card p-4 rounded-lg flex justify-between items-center"><span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-3"><Calendar className="w-4 h-4 text-blue-400"/> Próxima Consulta</span><span className="text-blue-400 font-mono text-sm">--/--</span></div></div><button onClick={() => setActiveModal(null)} className="mt-2 w-full py-3 border border-white/10 text-gray-500 rounded-lg text-xs uppercase tracking-widest hover:text-white hover:border-white/30 transition-colors">Fechar</button></div>
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
            {currentScreen === 'management' && <ManagementScreen navigateTo={navigateTo} myApps={myApps} setMyApps={setMyApps} purchaseApp={purchaseApp} />}
            
            {/* Sales Alchemist Integrated App */}
            {currentScreen === 'sales-alchemist' && (
                <div className="absolute inset-0 z-40 bg-slate-950 animate-fadeIn">
                    <SalesAlchemistApp onExit={() => navigateTo('management')} />
                </div>
            )}
             {/* Liberdade 360 Integrated App */}
            {currentScreen === 'liberdade-360' && (
                <div className="absolute inset-0 z-40 bg-slate-50 animate-fadeIn">
                    <Liberdade360App onExit={() => navigateTo('management')} />
                </div>
            )}
          </div>

          {/* Bottom Navigation (Hidden when in Full Apps) */}
          {currentScreen !== 'sales-alchemist' && currentScreen !== 'liberdade-360' && (
             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] h-16 glass-card rounded-2xl flex justify-around items-center px-4 shadow-2xl z-30">
                <button onClick={() => navigateTo('welcome')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'welcome' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-500 hover:text-gray-300'}`}><Trees className="w-5 h-5" /></button>
                <button onClick={() => navigateTo('management')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'management' ? 'text-blue-400 bg-blue-900/20' : 'text-gray-500 hover:text-gray-300'}`}><Briefcase className="w-5 h-5" /></button>
                <button onClick={() => navigateTo('diagnosis')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'diagnosis' || currentScreen === 'morning-call' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-500 hover:text-gray-300'}`}><Terminal className="w-5 h-5" /></button>
                <button onClick={() => navigateTo('sos')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'sos' ? 'text-red-500 bg-red-900/20' : 'text-gray-500 hover:text-gray-300'}`}><ShieldAlert className="w-5 h-5" /></button>
                <button onClick={() => navigateTo('emporio')} className={`p-2.5 rounded-xl transition-all ${currentScreen === 'emporio' || currentScreen === 'oracle' || currentScreen === 'pomodoro' ? 'text-emerald-500 bg-emerald-900/20' : 'text-gray-500 hover:text-gray-300'}`}><Store className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;

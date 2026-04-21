/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { BookOpen, Sparkles, Trophy, X, Download, RotateCcw, Medal } from 'lucide-react';
import { cn } from './lib/utils';
import { BSTIResult, drawBSTI, ACHIEVEMENTS, BSTI_DATA, Achievement, QUESTIONS, Question } from './data/bsti';
import { generateCardImage } from './lib/canvasExporter';
import { playSound } from './lib/sounds';

const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1490750967868-88cb4aca8fba?q=80&w=2670&auto=format&fit=crop', // Spring flowers bright
  'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=2674&auto=format&fit=crop', // Bright sunny clouds
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2488&auto=format&fit=crop', // Pink peach gradient
  'https://images.unsplash.com/photo-1514064019862-23e2a332a6a6?q=80&w=2514&auto=format&fit=crop', // Lemon bright
  'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop', // Light mint soft
];

function resolveImageSrc(src?: string) {
  if (!src) return '';
  if (/^(?:https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;

  const normalized = src.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${normalized}`;
}

export default function App() {
  const [view, setView] = useState<'home' | 'collection'>('home');
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<BSTIResult | null>(null);
  const [bgImage, setBgImage] = useState(BACKGROUNDS[0]);
  
  // Quiz states
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [currentBias, setCurrentBias] = useState<Record<string, number>>({});
  
  // Local storage state
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [totalDraws, setTotalDraws] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]); // Unlocked achievement IDs
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedIds = localStorage.getItem('phd_mbti_ids');
    const savedDraws = localStorage.getItem('phd_mbti_draws');
    const savedAchievements = localStorage.getItem('phd_mbti_achievements');
    if (savedIds) setUnlockedIds(JSON.parse(savedIds));
    if (savedDraws) setTotalDraws(parseInt(savedDraws, 10));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('phd_mbti_ids', JSON.stringify(unlockedIds));
    localStorage.setItem('phd_mbti_draws', totalDraws.toString());
    localStorage.setItem('phd_mbti_achievements', JSON.stringify(achievements));
  }, [unlockedIds, totalDraws, achievements]);

  const startQuizOrDraw = () => {
    if (isDrawing) return;
    if (view !== 'home') setView('home');
    
    // Select 3 random questions
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 3));
    setCurrentQuizStep(0);
    setCurrentBias({});
    setQuizMode(true);
  };

  const handleAnswer = (bias: Record<string, number>) => {
    const newBias = { ...currentBias };
    Object.entries(bias).forEach(([k, v]) => {
      newBias[k] = (newBias[k] || 0) + v;
    });
    setCurrentBias(newBias);

    if (currentQuizStep < 2) {
      setCurrentQuizStep(prev => prev + 1);
    } else {
      setQuizMode(false);
      executeDraw(newBias);
    }
  };

  const skipQuiz = () => {
    setQuizMode(false);
    executeDraw({});
  };

  const executeDraw = (bias: Record<string, number>) => {
    if (isDrawing) return;
    setIsDrawing(true);
    setResult(null);
    
    // Play sound or vibration if possible
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    playSound('shake');

    // Simulate Shake / Loading Animation
    setTimeout(() => {
      const drawn = drawBSTI(bias);
      setResult(drawn);
      setIsDrawing(false);
      
      // Update Stats
      const newTotal = totalDraws + 1;
      setTotalDraws(newTotal);
      
      // Randomly change background
      const nextBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      setBgImage(nextBg);
      
      let newIds = unlockedIds;
      if (!unlockedIds.includes(drawn.id)) {
        newIds = [...unlockedIds, drawn.id];
        setUnlockedIds(newIds);
      }

      // Check achievements
      checkAchievements(newIds, newTotal);

      // Play specific reveal sound
      playSound(`reveal_${drawn.rarity}` as any);

      // Trigger Advanced Visual Effects / Confetti
      const duration = 2500;
      const end = Date.now() + duration;

      if (drawn.rarity === 'UR') {
        const starParams = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100, shapes: ['star' as const], colors: ['#FFD700', '#FFA500', '#FF4500', '#FF69B4'] };
        confetti({ ...starParams, particleCount: 80, origin: { x: 0.5, y: 0.5 } });
        setTimeout(() => confetti({ ...starParams, particleCount: 50, origin: { x: 0.2, y: 0.6 } }), 200);
        setTimeout(() => confetti({ ...starParams, particleCount: 50, origin: { x: 0.8, y: 0.6 } }), 400);
      } else if (drawn.rarity === 'SR') {
        // Cherry blossom drift mechanism
        (function frame() {
          confetti({
            particleCount: 3, angle: 60, spread: 55, origin: { x: 0 },
            colors: ['#ffb7c5', '#ffc0cb', '#ffffff'], shapes: ['circle' as const],
            scalar: 0.8, drift: 1, gravity: 0.4, ticks: 200, zIndex: 100
          });
          confetti({
            particleCount: 3, angle: 120, spread: 55, origin: { x: 1 },
            colors: ['#ffb7c5', '#ffc0cb', '#ffffff'], shapes: ['circle' as const],
            scalar: 0.8, drift: -1, gravity: 0.4, ticks: 200, zIndex: 100
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
      } else if (drawn.rarity === 'R') {
        confetti({
          particleCount: 100, spread: 70, origin: { y: 0.6 },
          colors: ['#00FFFF', '#1E90FF', '#E0FFFF'], shapes: ['square' as const], zIndex: 100
        });
      } else {
        confetti({
          particleCount: 40, spread: 50, origin: { y: 0.7 },
          colors: ['#32CD32', '#98FB98', '#F0E68C'], zIndex: 100
        });
      }

    }, 1500); // 1.5s shake time
  };

  const checkAchievements = (ids: string[], total: number) => {
    for (const ach of ACHIEVEMENTS) {
      if (!achievements.includes(ach.id) && ach.condition(ids, total)) {
        setAchievements(prev => [...prev, ach.id]);
        setNewAchievement(ach);
        setTimeout(() => setNewAchievement(null), 4000);
      }
    }
  };

  const downloadCard = async () => {
    if (!result) return;
    try {
      const url = result.image
        ? resolveImageSrc(result.image)
        : `https://picsum.photos/seed/${result.id}_nanobanana/600/600`;
      const dataUrl = await generateCardImage(result, url);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `PHD-PERSONA-${result.bsti}.jpg`;
      link.click();
    } catch (e) {
      alert('保存图片失败，请稍后重试');
    }
  };

  return (
    <>
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Soft overlay to ensure readability */}
      <div className="fixed inset-0 -z-10 bg-white/60 backdrop-blur-3xl transition-opacity duration-1000"></div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {quizMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/30 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-2xl max-w-sm w-full rounded-[3rem] p-6 shadow-2xl border-4 border-white text-center flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-pink-50">
                <motion.div 
                  className="h-full bg-gradient-to-r from-pink-300 via-rose-300 to-orange-300"
                  animate={{ width: `${((currentQuizStep) / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-4 mt-2">
                Question {currentQuizStep + 1} / 3
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed font-serif">
                {quizQuestions[currentQuizStep]?.text}
              </h3>
              
              <div className="flex flex-col gap-3 w-full mb-6">
                {quizQuestions[currentQuizStep]?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.bias)}
                    className="w-full py-4 px-6 bg-rose-50/50 hover:bg-rose-100 text-rose-800 font-medium rounded-2xl transition-all border border-rose-100 hover:border-rose-200 active:scale-95 text-sm"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              
              <button
                onClick={skipQuiz}
                className="text-slate-400 hover:text-pink-400 text-xs font-medium transition-colors mb-2"
              >
                 跳过测试，直接抽签 &gt;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen text-slate-800 font-sans flex flex-col overflow-x-hidden selection:bg-pink-100 selection:text-pink-700">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/60 backdrop-blur-3xl px-6 py-4 flex justify-between items-center shadow-sm border-b border-white">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center shadow-md shadow-pink-300/30">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 text-transparent bg-clip-text font-serif">中关村学院博士人格测试</span>
          </h1>
          <p className="text-pink-400 text-[10px] mt-1 font-bold opacity-80 uppercase tracking-widest leading-none ml-10">ZGC ACADEMY PHD PERSONA TEST</p>
        </div>
        <button 
          onClick={() => setView(view === 'home' ? 'collection' : 'home')}
          className="flex items-center space-x-2 px-4 py-2 text-pink-600 bg-white/80 hover:bg-white rounded-full transition-all text-xs font-bold uppercase shadow-sm shadow-pink-100 border border-white"
        >
          {view === 'home' ? (
            <><Trophy className="w-4 h-4" /><span>Collection</span></>
          ) : (
            <><RotateCcw className="w-4 h-4" /><span>Back</span></>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 sm:pt-8 pb-32 flex flex-col relative">
        
        {/* Draw Screen */}
        {view === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[70vh] sm:min-h-[80vh]"
          >
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-black text-rose-900 leading-none font-serif drop-shadow-sm">测测你的博士人格</h2>
              <p className="text-orange-500 text-xs font-bold uppercase tracking-widest bg-orange-50/80 inline-block px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">Shake To Discover</p>
            </div>

            {/* Shakeable Container */}
            <motion.div 
              animate={isDrawing ? { 
                rotate: [0, -10, 10, -10, 10, -5, 5, 0],
                y: [0, -20, 0, -15, 0],
                scale: [1, 0.95, 1.05, 1]
              } : {}}
              transition={{ duration: 0.8, repeat: isDrawing ? Infinity : 0 }}
              onClick={startQuizOrDraw}
              className="relative cursor-pointer group select-none touch-manipulation my-4"
            >
              <div className="w-56 h-72 bg-gradient-to-br from-pink-300 via-rose-200 to-orange-200 rounded-[3rem] shadow-[0_20px_50px_rgba(244,114,182,0.3)] flex flex-col items-center justify-center border-[3px] border-white/90 overflow-hidden relative group backdrop-blur-md transition-transform hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-overlay blur-2xl opacity-60 pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-200 rounded-full mix-blend-overlay blur-2xl opacity-60 pointer-events-none"></div>
                
                <Sparkles className={cn("w-16 h-16 text-white mb-4 z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]", isDrawing && "animate-spin")} />
                <span className="font-bold text-white text-xl tracking-widest z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  {isDrawing ? '正在摇签...' : '点击抱走'}
                </span>
              </div>
              <div className="absolute -bottom-6 -z-10 w-44 h-8 bg-pink-400/20 rounded-full blur-xl left-1/2 -translate-x-1/2"></div>
            </motion.div>

            <div className="flex space-x-4 text-xs font-bold uppercase tracking-widest mt-6 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white/80">
              <span className="text-emerald-500 drop-shadow-sm">一般 50%</span>
              <span className="text-sky-500 drop-shadow-sm">稀有 30%</span>
              <span className="text-purple-500 drop-shadow-sm">超稀有 15%</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 drop-shadow-sm">极品 5%</span>
            </div>
            
            <div className="flex flex-col items-center mt-2 group cursor-default">
              <span className="text-[10px] font-bold uppercase text-rose-400 tracking-widest group-hover:text-orange-500 transition-colors">Total Drawn</span>
              <span className="text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 drop-shadow-sm">{totalDraws}</span>
            </div>
          </motion.div>
        )}

        {/* Collection Screen */}
        {view === 'collection' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Achievements Section */}
            <section className="bg-white/80 backdrop-blur-2xl p-6 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-2 border-white">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Unlocked Achievements</span>
                <span className="text-sm font-bold text-pink-500 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full shadow-inner">{achievements.length} / {ACHIEVEMENTS.length}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-pink-300 via-rose-300 to-orange-300 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${(achievements.length / ACHIEVEMENTS.length) * 100}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ACHIEVEMENTS.map(ach => {
                  const unlocked = achievements.includes(ach.id);
                  return (
                    <div key={ach.id} className={cn("p-4 rounded-[1.5rem] flex flex-row items-center space-x-4 transition-all border", unlocked ? "bg-white/90 border-orange-200 shadow-sm shadow-orange-100/50 hover:bg-white" : "bg-white/40 border-white/60 opacity-60")}>
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform shadow-sm border", unlocked ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-orange-200 text-orange-500 scale-105" : "bg-slate-50 border-slate-100 text-slate-300")}>
                        <Medal className="w-7 h-7" />
                      </div>
                      <div>
                        <div className={cn("font-bold text-base font-serif drop-shadow-sm", unlocked ? "text-slate-800" : "text-slate-500")}>{ach.name}</div>
                        <div className="text-xs font-medium text-slate-400 leading-snug mt-1">{ach.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Collection Section */}
            <section className="bg-white/80 backdrop-blur-2xl p-6 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-2 border-white">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-widest block mb-4">显微镜艺术家 ({unlockedIds.length}/{BSTI_DATA.length})</span>
              <div className="space-y-3">
                {BSTI_DATA.map(item => {
                  const unlocked = unlockedIds.includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => unlocked && setResult(item)}
                      className={cn("p-3 lg:p-4 rounded-[1.5rem] flex items-center gap-4 border transition-all",
                      unlocked ? "bg-white/90 border-white shadow-sm hover:scale-[1.01] hover:bg-white cursor-pointer" : "bg-white/40 border-white/60 opacity-50 grayscale cursor-not-allowed"
                    )}>
                      <div className={cn("w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner", 
                        unlocked ? (
                          item.rarity === 'UR' ? "bg-gradient-to-br from-pink-400 to-orange-400" :
                          item.rarity === 'SR' ? "bg-gradient-to-br from-purple-400 to-pink-400" :
                          item.rarity === 'R' ? "bg-gradient-to-br from-sky-400 to-blue-400" :
                          "bg-gradient-to-br from-emerald-400 to-teal-400"
                        ) : "bg-slate-300"
                      )}>
                        {item.rarity === 'UR' ? '极品' : item.rarity === 'SR' ? '超稀有' : item.rarity === 'R' ? '稀有' : '一般'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800 tracking-tight font-serif">{item.bsti}: {unlocked ? item.title : '???'}</div>
                        <div className={cn("text-[10px] font-bold uppercase mt-1 tracking-widest",
                          unlocked ? (
                            item.rarity === 'UR' ? 'text-orange-500' :
                            item.rarity === 'SR' ? 'text-pink-500' :
                            item.rarity === 'R' ? 'text-sky-500' :
                            'text-emerald-500'
                          ) : 'text-slate-400'
                        )}>
                          {item.rarity === 'UR' ? '极品 (Legendary)' : item.rarity === 'SR' ? '超稀有 (Super Rare)' : item.rarity === 'R' ? '稀有 (Rare)' : '一般 (Normal)'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

          </motion.div>
        )}
      </main>

      {/* Result Modal */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-2xl max-w-md w-full rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_40px_rgba(255,105,180,0.15)] border-4 border-white relative overflow-hidden flex flex-col max-h-[85vh] h-full"
            >
              {/* Rarity Colorful Background blur */}
              <div className={cn("absolute -top-32 -right-32 w-64 h-64 rounded-full mix-blend-multiply blur-[3rem] opacity-30 z-0",
                 result.rarity === 'UR' ? "bg-orange-300" :
                 result.rarity === 'SR' ? "bg-pink-300" :
                 result.rarity === 'R' ? "bg-sky-300" : "bg-emerald-300"
              )}></div>

      <div className="absolute top-5 right-5 z-30">
        <div className={cn("text-white font-bold px-4 py-1.5 rounded-full shadow-sm text-center uppercase tracking-widest text-xs border border-white/50 backdrop-blur-md",
          result.rarity === 'UR' ? "bg-gradient-to-r from-pink-400 to-orange-400" : 
          result.rarity === 'SR' ? "bg-gradient-to-r from-purple-400 to-pink-400" : 
          result.rarity === 'R' ? "bg-gradient-to-r from-sky-400 to-blue-500" : 
          "bg-gradient-to-r from-emerald-400 to-teal-500"
        )}>
          {result.rarity === 'UR' ? '极品' : result.rarity === 'SR' ? '超稀有' : result.rarity === 'R' ? '稀有' : '一般'}
        </div>
      </div>

              {/* Header Info */}
              <div className="relative aspect-[4/3] h-48 sm:h-56 w-[calc(100%-2rem)] mx-auto mt-4 rounded-[2rem] bg-slate-100 overflow-hidden group shrink-0 border-[3px] border-white/80 shadow-sm">
                <img 
                  // Use specific persona image if specified, otherwise fallback to placeholder
                  src={result.image ? resolveImageSrc(result.image) : `https://picsum.photos/seed/${result.id}_nanobanana/600/400`} 
                  alt={result.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute bottom-3 left-3 right-3 h-14 bg-white/70 backdrop-blur-md rounded-xl flex items-center justify-center z-20 border border-white/50 shadow-sm">
                   <span className={cn("font-bold text-xl uppercase tracking-widest drop-shadow-sm font-serif",
                     result.rarity === 'UR' ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600" :
                     result.rarity === 'SR' ? "text-fuchsia-700" :
                     result.rarity === 'R' ? "text-sky-700" : "text-emerald-700"
                   )}>{result.bsti}</span>
                </div>
                
                <button 
                  onClick={() => setResult(null)}
                  className="absolute top-3 left-3 p-2 bg-white/50 hover:bg-white/90 text-slate-800 rounded-full backdrop-blur-md transition-colors z-20 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="p-6 pb-2 flex-1 overflow-y-auto bg-transparent z-10 flex flex-col">
                <div className="mb-6 text-center shrink-0">
                  <h3 className="text-3xl font-bold text-rose-900 leading-tight font-serif">
                    {result.title}
                  </h3>
                  <div className="text-lg italic text-rose-500 mt-3 leading-relaxed font-serif">&ldquo;{result.quote}&rdquo;</div>
                </div>

                <div className={cn("p-5 rounded-3xl shrink-0 border bg-white/50 shadow-sm",
                  result.rarity === 'UR' ? "border-orange-200" :
                  result.rarity === 'SR' ? "border-pink-200" :
                  result.rarity === 'R' ? "border-sky-200" :
                  "border-emerald-200"
                )}>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest block mb-2",
                    result.rarity === 'UR' ? "text-orange-500" :
                    result.rarity === 'SR' ? "text-pink-500" :
                    result.rarity === 'R' ? "text-sky-600" : "text-emerald-600"
                  )}>About this Persona</span>
                  <div className="text-slate-700 font-medium text-sm leading-relaxed font-serif">
                    {result.desc}
                  </div>
                </div>
              </div>

              {/* Sticky Buttons at Bottom */}
              <div className="p-6 pt-2 shrink-0 z-20 bg-transparent flex flex-col">
                <div className="flex space-x-3 w-full">
                  <button 
                    onClick={downloadCard}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-4 rounded-[2rem] shadow-sm transition-all flex items-center justify-center gap-2 text-sm uppercase active:scale-95"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                    <span>Save</span>
                  </button>
                  <button 
                    onClick={startQuizOrDraw}
                    className="flex-[2] bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-bold py-4 rounded-[2rem] shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase group border border-white/20 active:scale-95"
                  >
                     <span>Again</span>
                     <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Toast */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[60] bg-white/90 backdrop-blur-xl border border-amber-200 text-amber-700 px-6 py-4 rounded-full shadow-lg flex items-center space-x-3 min-w-[280px]"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-200 to-orange-300 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm border border-amber-100">
              <Medal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest drop-shadow-sm">成就解锁 Achievement</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5 font-serif">{newAchievement.name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

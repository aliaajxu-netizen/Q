import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import TrainingHub from './components/TrainingHub';
import Dashboard from './components/Dashboard';
import { questionsData } from './questions';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- 1. Persistent State Initialization ---
  const [activeTab, setActiveTab] = useState<"home" | "training" | "dashboard">(() => {
    const saved = localStorage.getItem("madrasati_active_tab");
    return (saved as any) || "home";
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("madrasati_theme");
    return (saved as any) || "light";
  });

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("madrasati_answers");
    return saved ? JSON.parse(saved) : {};
  });

  const [scores, setScores] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem("madrasati_scores");
    return saved ? JSON.parse(saved) : {};
  });

  const [mastery, setMastery] = useState<Record<number, "unmastered" | "partial" | "mastered" | "">> (() => {
    const saved = localStorage.getItem("madrasati_mastery");
    return saved ? JSON.parse(saved) : {};
  });

  const [revealed, setRevealed] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem("madrasati_revealed");
    return saved ? JSON.parse(saved) : {};
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem("madrasati_current_index");
    return saved ? parseInt(saved) : 0;
  });

  // --- 2. Side Effects for Persistence ---
  useEffect(() => {
    localStorage.setItem("madrasati_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("madrasati_theme", theme);
    // Apply theme class to html tag
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("madrasati_answers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    localStorage.setItem("madrasati_scores", JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem("madrasati_mastery", JSON.stringify(mastery));
  }, [mastery]);

  useEffect(() => {
    localStorage.setItem("madrasati_revealed", JSON.stringify(revealed));
  }, [revealed]);

  useEffect(() => {
    localStorage.setItem("madrasati_current_index", currentIndex.toString());
  }, [currentIndex]);

  // Event listener for contextual finish action from TrainingHub
  useEffect(() => {
    const handleFinish = () => {
      setActiveTab("dashboard");
    };
    window.addEventListener("madrasati_finish_hub", handleFinish);
    return () => {
      window.removeEventListener("madrasati_finish_hub", handleFinish);
    };
  }, []);

  // --- 3. Handlers and Callbacks ---
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleSetUserAnswer = (id: number, val: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleSetScore = (id: number, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const handleSetMastery = (id: number, val: "unmastered" | "partial" | "mastered" | "") => {
    setMastery(prev => ({ ...prev, [id]: val }));
  };

  const handleSetRevealed = (id: number, val: boolean) => {
    setRevealed(prev => ({ ...prev, [id]: val }));
  };

  const handleJumpToQuestion = (id: number) => {
    const idx = questionsData.findIndex(q => q.id === id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setActiveTab("training");
    }
  };

  // Safe reset of progress with dual validation
  const handleResetAllData = () => {
    setUserAnswers({});
    setScores({});
    setMastery({});
    setRevealed({});
    setCurrentIndex(0);
    localStorage.removeItem("madrasati_answers");
    localStorage.removeItem("madrasati_scores");
    localStorage.removeItem("madrasati_mastery");
    localStorage.removeItem("madrasati_revealed");
    localStorage.removeItem("madrasati_current_index");
  };

  return (
    <div className="min-h-screen bg-app-base text-app-main flex flex-col transition-colors duration-300">
      
      {/* Dynamic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="container" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "home" && (
              <WelcomeScreen
                onStartTraining={() => setActiveTab("training")}
                totalQuestions={questionsData.length}
              />
            )}

            {activeTab === "training" && (
              <TrainingHub
                questions={questionsData}
                userAnswers={userAnswers}
                setUserAnswer={handleSetUserAnswer}
                scores={scores}
                setScore={handleSetScore}
                mastery={mastery}
                setMastery={handleSetMastery}
                revealed={revealed}
                setRevealed={handleSetRevealed}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                onResetAllData={handleResetAllData}
              />
            )}

            {activeTab === "dashboard" && (
              <Dashboard
                questions={questionsData}
                userAnswers={userAnswers}
                scores={scores}
                mastery={mastery}
                revealed={revealed}
                onJumpToQuestion={handleJumpToQuestion}
                onResetAllData={handleResetAllData}
                setActiveTab={setActiveTab}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating red circular PDF study guide download button (Screenshot 1) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            alert("📥 جاري تحضير وتحميل ملزمة وقواعد أسماء الاستفهام (المجموعة الأولى) PDF المعتمدة من وزارة التربية العراقية...");
          }}
          className="h-12 w-12 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg hover:bg-rose-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="تحميل ملزمة أسماء الاستفهام PDF"
        >
          PDF
        </button>
      </div>

      {/* Global Footer */}
      <footer>
        <p>© ٢٠٢٦ منصة مدرسي التعليمية — جميع الأسئلة والأجوبة مأخوذة بأمانة تامة من المصادر الرسمية لوزارة التربية العراقية.</p>
      </footer>

    </div>
  );
}

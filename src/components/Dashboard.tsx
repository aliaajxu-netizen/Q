import React from 'react';
import { Question } from '../questions';
import { 
  AlertTriangle,
  RotateCcw,
  Pencil
} from 'lucide-react';

interface DashboardProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  scores: Record<number, number>;
  mastery: Record<number, "unmastered" | "partial" | "mastered" | "">;
  revealed: Record<number, boolean>;
  onJumpToQuestion: (id: number) => void;
  onResetAllData: () => void;
  setActiveTab: (tab: "home" | "training" | "dashboard") => void;
}

export default function Dashboard({
  questions,
  userAnswers,
  scores,
  mastery,
  revealed,
  onJumpToQuestion,
  onResetAllData,
  setActiveTab,
}: DashboardProps) {

  // Metrices
  const totalSolved = questions.filter(q => userAnswers[q.id] && userAnswers[q.id].trim() !== "").length;
  
  const unmasteredCount = questions.filter(q => mastery[q.id] === "unmastered").length;
  const partialCount = questions.filter(q => mastery[q.id] === "partial").length;
  const masteredCount = questions.filter(q => mastery[q.id] === "mastered").length;

  const totalRated = questions.filter(q => mastery[q.id] && mastery[q.id] !== "").length;
  const revealedCount = questions.filter(q => revealed[q.id] === true).length;

  // Total scores
  const sumScores = questions.reduce((sum, q) => sum + (scores[q.id] || 0), 0);
  const maxPossibleScores = questions.length * 10;
  const scorePercentage = maxPossibleScores > 0 ? Math.round((sumScores / maxPossibleScores) * 100) : 0;

  // Unrated revealed questions (questions revealed but no mastery chosen yet)
  const unratedRevealed = questions.filter(q => revealed[q.id] === true && (!mastery[q.id] || mastery[q.id] === ""));

  // Calculate percentage height for the bar charts
  const totalFeedbackCount = unmasteredCount + partialCount + masteredCount;
  const getBarHeightPercent = (count: number) => {
    if (totalFeedbackCount === 0) return 0;
    return Math.max(8, Math.round((count / totalFeedbackCount) * 100));
  };

  // Generate gorgeous achievement badges based on progress percentage
  const renderAchievementBadge = () => {
    const percent = questions.length > 0 ? (totalSolved / questions.length) * 100 : 0;
    
    if (percent === 100) {
      return (
        <div className="achievement-badge-card badge-gold">
          <div className="badge-ribbon">وسام التمكين الذهبي 🏆</div>
          <div className="badge-image-container">
            <span className="text-7xl z-10 select-none">🥇</span>
          </div>
          <h4 className="badge-card-title">وسام التمكين مفتوح 🎉</h4>
          <p className="badge-card-desc">
            لقد أنجزت حل وتدوين جميع الأسئلة الوزارية بنجاح باهر! أنت الآن متمكن تماماً ومستعد للعلامة الكاملة.
          </p>
        </div>
      );
    }
    
    if (percent >= 70) {
      return (
        <div className="achievement-badge-card badge-silver">
          <div className="badge-ribbon">وسام الاجتهاد الفضي 🥈</div>
          <div className="badge-image-container">
            <span className="text-7xl z-10 select-none">🥈</span>
          </div>
          <h4 className="badge-card-title">وسام الاجتهاد مفتوح 🌟</h4>
          <p className="badge-card-desc">
            لقد حللت أغلب الأسئلة الوزارية بنجاح وبجهد مشرف! واصل تقدمك للحصول على وسام التمكين الذهبي.
          </p>
        </div>
      );
    }

    if (percent >= 30) {
      return (
        <div className="achievement-badge-card badge-bronze">
          <div className="badge-ribbon">وسام المثابرة البرونزي 🥉</div>
          <div className="badge-image-container">
            <span className="text-7xl z-10 select-none">🥉</span>
          </div>
          <h4 className="badge-card-title">وسام المثابرة مفتوح ✨</h4>
          <p className="badge-card-desc">
            أنت في الطريق الصحيح للتميز وتجاوزت ثلث المنهج بنجاح. استمر في التدريب لحصد الأوسمة الأعلى!
          </p>
        </div>
      );
    }

    return (
      <div className="achievement-badge-card badge-locked">
        <div className="badge-ribbon">وسام مغلق 🔒</div>
        <div className="badge-image-container">
          <span className="text-7xl z-10 select-none">🔒</span>
        </div>
        <h4 className="badge-card-title">أوسمة التمكين مغلقة</h4>
        <p className="badge-card-desc">
          أكمل حل جميع الأسئلة ({totalSolved} من أصل {questions.length}) لتفتح وسام التمكين والتميز وتزين به سجل إنجازاتك في اللغة العربية!
        </p>
      </div>
    );
  };

  return (
    <div className="results-screen">
      
      {/* Page Title */}
      <h2 className="results-title font-sans">
        تقرير الأداء والتقييم الذاتي
      </h2>

      {/* 1. Circular Score Gauge */}
      <div className="score-circle-container">
        <div className="score-circle">
          <span className="score-value">{sumScores}/{maxPossibleScores}</span>
          <span className="score-label">النسبة المئوية: {scorePercentage}%</span>
        </div>
      </div>

      {/* 2. Achievement Badge Status */}
      {renderAchievementBadge()}

      {/* 3. Bar Chart section: "توزيع مستويات التمكن الأكاديمي" */}
      <div className="w-full bg-white dark:bg-[#161226] border border-[#D9D3F0] dark:border-purple-950/40 rounded-3xl p-6 shadow-sm flex flex-col gap-6 mb-8">
        <h3 className="text-xs md:text-sm font-black text-[#3E176D] dark:text-purple-300 text-center">
          توزيع مستويات التمكن الأكاديمي (تقييم تفاعلي)
        </h3>

        {totalFeedbackCount > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-around h-48 border-b border-[#D9D3F0] dark:border-purple-900/50 pb-2 px-4">
              
              {/* Bar 1: متمكن */}
              <div className="flex flex-col items-center gap-2 w-16 chart-bar-group">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {masteredCount}
                </span>
                <div 
                  style={{ height: `${getBarHeightPercent(masteredCount)}%` }} 
                  className="w-10 bg-emerald-500 dark:bg-emerald-600 rounded-t-lg shadow-sm transition-all duration-500 chart-bar"
                />
                <span className="text-[10px] font-bold text-[#687084] dark:text-purple-400 mt-1">متمكن</span>
              </div>

              {/* Bar 2: يحتاج مراجعة */}
              <div className="flex flex-col items-center gap-2 w-16 chart-bar-group">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                  {partialCount}
                </span>
                <div 
                  style={{ height: `${getBarHeightPercent(partialCount)}%` }} 
                  className="w-10 bg-amber-500 dark:bg-amber-600 rounded-t-lg shadow-sm transition-all duration-500 chart-bar"
                />
                <span className="text-[10px] font-bold text-[#687084] dark:text-purple-400 mt-1">يحتاج مراجعة</span>
              </div>

              {/* Bar 3: غير متمكن */}
              <div className="flex flex-col items-center gap-2 w-16 chart-bar-group">
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">
                  {unmasteredCount}
                </span>
                <div 
                  style={{ height: `${getBarHeightPercent(unmasteredCount)}%` }} 
                  className="w-10 bg-rose-500 dark:bg-rose-600 rounded-t-lg shadow-sm transition-all duration-500 chart-bar"
                />
                <span className="text-[10px] font-bold text-[#687084] dark:text-purple-400 mt-1">غير متمكن</span>
              </div>

            </div>

            {/* Custom Legend (Bullet lists) */}
            <div className="flex justify-center items-center gap-6 text-[10px] md:text-xs font-black text-[#687084] dark:text-purple-400">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span>متمكن</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                <span>أحتاج لمراجعة</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                <span>غير متمكن</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-[#687084] dark:text-purple-400">
            <p className="text-xs font-bold">لا تتوفر إحصائيات تقييم كافية حالياً.</p>
            <p className="text-[10px] mt-1 leading-relaxed max-w-xs mx-auto">ابدأ بالتدريب وحدّد مستويات تمكنك لتظهر نتائج المخطط هنا.</p>
          </div>
        )}
      </div>

      {/* 4. Results Grid */}
      <div className="results-grid">
        <div className="stat-item">
          <span className="stat-label">عدد الأسئلة الكلي:</span>
          <span className="stat-val font-mono">{questions.length}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">الأسئلة التي تمت إجابتها:</span>
          <span className="stat-val font-mono">{totalSolved}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">الإجابات النموذجية المعروضة:</span>
          <span className="stat-val font-mono">{revealedCount}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">الأسئلة التي تم تقييمها:</span>
          <span className="stat-val font-mono">{totalRated}</span>
        </div>
      </div>

      {/* 5. Mastery Summary */}
      <div className="mastery-summary">
        <h3 className="mastery-summary-title font-sans">
          ملخص مستوى التمكن:
        </h3>
        
        <div className="mastery-summary-grid">
          {/* Card Left: غير متمكن */}
          <div className="mastery-sum-card low">
            <span className="mastery-sum-count font-mono">{unmasteredCount}</span>
            <span className="mastery-sum-label">غير متمكن</span>
          </div>

          {/* Card Center: أحتاج إلى مراجعة الموضوع */}
          <div className="mastery-sum-card mid">
            <span className="mastery-sum-count font-mono">{partialCount}</span>
            <span className="mastery-sum-label">أحتاج إلى مراجعة</span>
          </div>

          {/* Card Right: متمكن من السؤال */}
          <div className="mastery-sum-card high">
            <span className="mastery-sum-count font-mono">{masteredCount}</span>
            <span className="mastery-sum-label">متمكن من السؤال</span>
          </div>
        </div>
      </div>

      {/* 6. Warning Box: Revealed but not evaluated questions */}
      {unratedRevealed.length > 0 && (
        <div className="unrated-list">
          <div className="unrated-title flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>تنبيه: لديك أسئلة تم عرض إجابتها النموذجية ولكن لم تقيّمها بعد:</span>
          </div>

          {/* Circular interactive jump buttons for each pending question */}
          <div className="unrated-items mt-2">
            {unratedRevealed.map((q) => {
              const origIndex = questions.findIndex(item => item.id === q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onJumpToQuestion(origIndex);
                    setActiveTab("training");
                  }}
                  className="unrated-link text-xs"
                >
                  سؤال {questions.findIndex(item => item.id === q.id) + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Action Button Panel */}
      <div className="results-actions">
        {/* Return to training */}
        <button
          id="btn-return-training"
          onClick={() => setActiveTab("training")}
          className="btn btn-primary"
        >
          <Pencil className="h-4.5 w-4.5" />
          <span>العودة لتعديل التقييمات</span>
        </button>

        {/* Start a new attempt */}
        <button
          id="btn-reset-data"
          onClick={() => {
            if (window.confirm("هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات وبدء محاولة جديدة تماماً؟")) {
              onResetAllData();
              setActiveTab("home");
            }
          }}
          className="btn btn-secondary"
        >
          <RotateCcw className="h-4.5 w-4.5" />
          <span>بدء محاولة جديدة تماماً</span>
        </button>
      </div>

    </div>
  );
}

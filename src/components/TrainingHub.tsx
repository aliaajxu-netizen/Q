import React, { useRef, useState, useEffect } from 'react';
import { Question } from '../questions';
import { 
  Eye, 
  Check, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrainingHubProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  setUserAnswer: (id: number, val: string) => void;
  scores: Record<number, number>;
  setScore: (id: number, val: number) => void;
  mastery: Record<number, "unmastered" | "partial" | "mastered" | "">;
  setMastery: (id: number, val: "unmastered" | "partial" | "mastered" | "") => void;
  revealed: Record<number, boolean>;
  setRevealed: (id: number, val: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onResetAllData: () => void;
}

export default function TrainingHub({
  questions,
  userAnswers,
  setUserAnswer,
  scores,
  setScore,
  mastery,
  setMastery,
  revealed,
  setRevealed,
  currentIndex,
  setCurrentIndex,
  onResetAllData,
}: TrainingHubProps) {
  
  // Tag filters
  const [currentFilter, setCurrentFilter] = useState<"all" | "unsolved" | "unrated" | "review" | "unmastered" | "mastered">("all");

  const filteredQuestions = questions.filter(q => {
    const answered = userAnswers[q.id] && userAnswers[q.id].trim() !== "";
    const rated = !!mastery[q.id];
    
    if (currentFilter === "unsolved") return !answered;
    if (currentFilter === "unrated") return answered && !rated;
    if (currentFilter === "review") return mastery[q.id] === "partial";
    if (currentFilter === "unmastered") return mastery[q.id] === "unmastered";
    if (currentFilter === "mastered") return mastery[q.id] === "mastered";
    return true;
  });

  const currentFilteredIndex = filteredQuestions.findIndex(q => q.id === questions[currentIndex]?.id);
  const activeFilteredIndex = currentFilteredIndex !== -1 ? currentFilteredIndex : 0;
  const currentQuestion = filteredQuestions[activeFilteredIndex];

  // Stats
  const totalSolved = Object.keys(userAnswers).filter(id => userAnswers[Number(id)]?.trim().length > 0).length;
  const progressPercent = questions.length > 0 ? Math.round((totalSolved / questions.length) * 100) : 0;

  const totalRated = Object.keys(mastery).filter(id => !!mastery[Number(id)]).length;
  const ratedPercent = questions.length > 0 ? Math.round((totalRated / questions.length) * 100) : 0;

  const handleNext = () => {
    if (activeFilteredIndex < filteredQuestions.length - 1) {
      const nextQ = filteredQuestions[activeFilteredIndex + 1];
      const realIdx = questions.findIndex(item => item.id === nextQ.id);
      setCurrentIndex(realIdx);
    }
  };

  const handlePrev = () => {
    if (activeFilteredIndex > 0) {
      const prevQ = filteredQuestions[activeFilteredIndex - 1];
      const realIdx = questions.findIndex(item => item.id === prevQ.id);
      setCurrentIndex(realIdx);
    }
  };

  // Helper to format quranic/poetic text
  const renderQuestionText = (text: string, isQuranic: boolean) => {
    if (isQuranic) {
      return (
        <div className="quran-container">
          <p className="quran-verse font-quran">{text}</p>
        </div>
      );
    }

    if (text.includes(" — ")) {
      const parts = text.split(" — ");
      return (
        <div className="poetry-verse">
          <div className="poetry-two-halves">
            <span className="poetry-hemistich">{parts[0]}</span>
            <span className="poetry-separator">★</span>
            <span className="poetry-hemistich">{parts[1]}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="poetry-verse">
        <p className="poetry-line">{text}</p>
      </div>
    );
  };

  // Status indicators in card header
  const getQuestionStatusBadge = (qId: number) => {
    const isAnswered = userAnswers[qId] && userAnswers[qId].trim() !== "";
    const isRevealed = revealed[qId];
    const isRated = !!mastery[qId];

    if (isRated) {
      return <span className="status-badge status-rated">تم التقييم</span>;
    }
    if (isRevealed) {
      return <span className="status-badge status-viewed">تمت مشاهدة الحل</span>;
    }
    if (isAnswered) {
      return <span className="status-badge status-answered">تمت الإجابة</span>;
    }
    return <span className="status-badge status-unanswered">لم تتم الإجابة</span>;
  };

  // Mastery badge in card header
  const getMasteryBadge = (qId: number) => {
    const val = mastery[qId];
    if (val === "mastered") {
      return <span className="mastery-badge mastery-high">متمكن من السؤال</span>;
    }
    if (val === "partial") {
      return <span className="mastery-badge mastery-mid">أحتاج إلى مراجعة</span>;
    }
    if (val === "unmastered") {
      return <span className="mastery-badge mastery-low">غير متمكن</span>;
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Practice view header progress bars */}
      <header className="practice-header">
        <div className="progress-container">
          <span className="progress-label">
            أسئلة أجبت عليها: {totalSolved} من {questions.length}
          </span>
          <span className="progress-label font-mono">
            {progressPercent}%
          </span>
        </div>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${progressPercent}%` }}></div>
        </div>
        
        <div className="progress-container" style={{ marginTop: '0.75rem' }}>
          <span className="progress-label">
            نسبة الأسئلة المقيمة: {totalRated} من {questions.length}
          </span>
          <span className="progress-label font-mono">
            {ratedPercent}%
          </span>
        </div>
        <div className="progress-bar-outer" style={{ marginBottom: '1rem' }}>
          <div className="progress-bar-inner" style={{ width: `${ratedPercent}%`, backgroundColor: '#10B981' }}></div>
        </div>
      </header>

      {/* 2. Filter Bar */}
      <div className="filter-bar">
        <span className="filter-label">تصفية الأسئلة:</span>
        <div className="filter-options">
          <button
            onClick={() => setCurrentFilter("all")}
            className={`filter-btn ${currentFilter === "all" ? "active" : ""}`}
          >
            الكل
          </button>
          <button
            onClick={() => setCurrentFilter("unsolved")}
            className={`filter-btn ${currentFilter === "unsolved" ? "active" : ""}`}
          >
            غير المحلولة
          </button>
          <button
            onClick={() => setCurrentFilter("unrated")}
            className={`filter-btn ${currentFilter === "unrated" ? "active" : ""}`}
          >
            لم يتم التقييم
          </button>
          <button
            onClick={() => setCurrentFilter("review")}
            className={`filter-btn ${currentFilter === "review" ? "active" : ""}`}
          >
            تحتاج مراجعة
          </button>
          <button
            onClick={() => setCurrentFilter("unmastered")}
            className={`filter-btn ${currentFilter === "unmastered" ? "active" : ""}`}
          >
            غير متمكن
          </button>
          <button
            onClick={() => setCurrentFilter("mastered")}
            className={`filter-btn ${currentFilter === "mastered" ? "active" : ""}`}
          >
            متمكن
          </button>
        </div>
      </div>

      {/* Top Pagination Container */}
      <div className="bottom-pagination-container">
        <div className="pagination-header">
          <div className="pagination-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            <span>الوصول السريع للأسئلة:</span>
          </div>
          <div className="pagination-legend">
            <div className="legend-item">
              <span className="legend-dot unanswered"></span>
              <span>غير مجاب</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span>
              <span>مجاب</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot active" style={{ backgroundColor: 'var(--color-primary)' }}></span>
              <span>السؤال الحالي</span>
            </div>
          </div>
        </div>

        <div className="pagination-list">
          {filteredQuestions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] && userAnswers[q.id].trim() !== "";
            const isActive = currentQuestion && q.id === currentQuestion.id;
            
            let btnClass = "unanswered";
            if (isActive) btnClass = "active";
            else if (isAnswered) btnClass = "answered";

            return (
              <button
                key={q.id}
                onClick={() => {
                  const realIdx = questions.findIndex(item => item.id === q.id);
                  if (realIdx !== -1) {
                    setCurrentIndex(realIdx);
                  }
                }}
                className={`pagination-item-btn ${btnClass}`}
              >
                <span className="btn-num">{idx + 1}</span>
                <span className={`status-indicator-badge ${isAnswered ? "answered-badge" : "unanswered-badge"}`}>
                  {isAnswered ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Questions List (Accordion format) */}
      <div className="questions-list">
        <AnimatePresence mode="popLayout">
          {currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="accordion-card active"
            >
              {/* Accordion Card Header */}
              <div className="card-header">
                <div className="card-header-left">
                  <div className="question-num-badge font-sans">
                    {questions.findIndex(q => q.id === currentQuestion.id) + 1}
                  </div>
                  <span className="question-preview-text font-sans">
                    {currentQuestion.requirement}
                  </span>
                </div>
                
                <div className="card-header-right">
                  {getQuestionStatusBadge(currentQuestion.id)}
                  {getMasteryBadge(currentQuestion.id)}
                  <div className="collapse-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Accordion Card Body (Expanded) */}
              <div className="card-body">
                {/* Badges Row */}
                <div className="badges-row">
                  <span className="year-badge">السنة: {currentQuestion.year}</span>
                  {currentQuestion.subType && (
                    <span className="year-badge" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', borderColor: '#BAE6FD' }}>
                      المحل الإعرابي: {currentQuestion.subType}
                    </span>
                  )}
                </div>

                {/* Question Instruction Text */}
                <h4 className="question-text">{currentQuestion.requirement}</h4>

                {/* Poetic/Quranic Witness Text */}
                {renderQuestionText(currentQuestion.text, currentQuestion.isQuranic)}

                {/* Input Textarea */}
                <div className="answer-input-container">
                  <label className="answer-label">إجابتك الشخصية يا بطل:</label>
                  <textarea
                    className="answer-textarea"
                    value={userAnswers[currentQuestion.id] || ""}
                    onChange={(e) => setUserAnswer(currentQuestion.id, e.target.value)}
                    disabled={revealed[currentQuestion.id]}
                    placeholder="اكتب هنا إجابتك النحوية الكاملة قبل عرض الإجابة النموذجية..."
                  />
                </div>

                {/* Submit action */}
                <div className="submit-action-row">
                  {!revealed[currentQuestion.id] && (
                    <button
                      className="btn btn-primary"
                      disabled={!userAnswers[currentQuestion.id] || userAnswers[currentQuestion.id].trim() === ""}
                      onClick={() => setRevealed(currentQuestion.id, true)}
                    >
                      <Eye className="h-4.5 w-4.5" />
                      <span>أظهر الجواب النموذجي</span>
                    </button>
                  )}
                </div>

                {/* Model Answer Section */}
                {revealed[currentQuestion.id] && (
                  <div className="model-answer-section" style={{ display: 'block' }}>
                    <div className="model-answer-title">
                      <Check className="h-4 w-4" />
                      <span>الجواب النموذجي</span>
                    </div>
                    <p className="model-answer-text">{currentQuestion.answer}</p>
                  </div>
                )}

                {/* Self Evaluation & Mastery Section */}
                {revealed[currentQuestion.id] && (
                  <div className="evaluation-section" style={{ display: 'block' }}>
                    <h3 className="eval-title">ميزان التقييم الذاتي الأكاديمي</h3>
                    <p className="eval-subtitle">
                      قارن إجابتك بالحل النموذجي أعلاه بدقة، ثم اختر الدرجة التي تستحقها على هذا التدريب الأكاديمي:
                    </p>

                    {/* Academic Slider Wrapper */}
                    <div className="academic-slider-wrapper">
                      <div className="academic-badge-container">
                        <span className="academic-score-title">التقدير الأكاديمي:</span>
                        <span className="academic-score-badge">
                          {scores[currentQuestion.id] !== undefined ? `${scores[currentQuestion.id]} / 10` : "يرجى اختيار درجة التقييم"}
                        </span>
                      </div>

                      {/* Slider Node Track */}
                      <div className="academic-slider-container">
                        <div className="academic-slider-track">
                          <div 
                            className="academic-slider-fill" 
                            style={{ width: `${(scores[currentQuestion.id] || 0) * 10}%` }}
                          ></div>
                        </div>
                        <div className="academic-slider-steps">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                            const isSelected = scores[currentQuestion.id] === num;
                            const leftPercent = `${num * 10}%`;
                            return (
                              <button
                                key={num}
                                onClick={() => setScore(currentQuestion.id, num)}
                                className={`step-node ${isSelected ? "selected" : ""}`}
                                style={{ left: leftPercent }}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Milestones Legend */}
                      <div className="academic-milestones">
                        <div className="milestone milestone-low">تأسيس وتركيز مكثف (0-2)</div>
                        <div className="milestone milestone-mid">مقبول إلى جيد (3-6)</div>
                        <div className="milestone milestone-high">ممتاز ومتمكن (7-10)</div>
                      </div>
                    </div>

                    {/* Mastery section */}
                    <div className="mastery-section">
                      <h4 className="mastery-title">تصنيف مستوى تمكنك من مهارة السؤال:</h4>
                      <div className="mastery-buttons">
                        <button
                          className={`btn-mastery ${mastery[currentQuestion.id] === "unmastered" ? "selected-low" : ""}`}
                          onClick={() => setMastery(currentQuestion.id, "unmastered")}
                        >
                          غير متمكن
                        </button>
                        <button
                          className={`btn-mastery ${mastery[currentQuestion.id] === "partial" ? "selected-mid" : ""}`}
                          onClick={() => setMastery(currentQuestion.id, "partial")}
                        >
                          أحتاج إلى مراجعة الموضوع
                        </button>
                        <button
                          className={`btn-mastery ${mastery[currentQuestion.id] === "mastered" ? "selected-high" : ""}`}
                          onClick={() => setMastery(currentQuestion.id, "mastered")}
                        >
                          متمكن من السؤال
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="empty-filter-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <h3>لا توجد أسئلة تطابق الفلتر المختار</h3>
              <p>يرجى اختيار تصفية أخرى أو تهيئة تصفية "الكل" لعرض كافة الأسئلة.</p>
              <button
                onClick={() => setCurrentFilter("all")}
                className="btn btn-primary"
              >
                عرض كل الأسئلة
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Pagination Container */}
      <div className="bottom-pagination-container">
        <div className="pagination-header">
          <div className="pagination-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            <span>الوصول السريع للأسئلة:</span>
          </div>
          <div className="pagination-legend">
            <div className="legend-item">
              <span className="legend-dot unanswered"></span>
              <span>غير مجاب</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span>
              <span>مجاب</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot active" style={{ backgroundColor: 'var(--color-primary)' }}></span>
              <span>السؤال الحالي</span>
            </div>
          </div>
        </div>

        <div className="pagination-list">
          {filteredQuestions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] && userAnswers[q.id].trim() !== "";
            const isActive = currentQuestion && q.id === currentQuestion.id;
            
            let btnClass = "unanswered";
            if (isActive) btnClass = "active";
            else if (isAnswered) btnClass = "answered";

            return (
              <button
                key={q.id}
                onClick={() => {
                  const realIdx = questions.findIndex(item => item.id === q.id);
                  if (realIdx !== -1) {
                    setCurrentIndex(realIdx);
                  }
                }}
                className={`pagination-item-btn ${btnClass}`}
              >
                <span className="btn-num">{idx + 1}</span>
                <span className={`status-indicator-badge ${isAnswered ? "answered-badge" : "unanswered-badge"}`}>
                  {isAnswered ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Navigation Bars */}
      <div className="bottom-nav">
        <button
          onClick={handlePrev}
          disabled={activeFilteredIndex === 0}
          className="btn btn-secondary font-sans"
        >
          <ChevronRight className="h-4.5 w-4.5" />
          <span>السؤال السابق</span>
        </button>

        <button
          id="finish-training-btn"
          onClick={() => {
            const finishBtn = document.getElementById("nav-tab-dashboard");
            if (finishBtn) {
              finishBtn.click();
            } else {
              window.dispatchEvent(new CustomEvent("madrasati_finish_hub"));
            }
          }}
          className="btn btn-primary font-sans"
        >
          إنهاء التدريب وعرض النتيجة
        </button>

        <button
          onClick={handleNext}
          disabled={activeFilteredIndex === filteredQuestions.length - 1}
          className="btn btn-secondary font-sans"
        >
          <span>السؤال التالي</span>
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
}

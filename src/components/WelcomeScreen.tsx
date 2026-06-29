import { GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onStartTraining: () => void;
  totalQuestions: number;
}

export default function WelcomeScreen({ onStartTraining, totalQuestions }: WelcomeScreenProps) {
  return (
    <div className="home-screen">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="home-logo-container"
      >
        <img 
          className="home-logo" 
          src="/madrasati_logo.png" 
          alt="شعار مدرسي" 
        />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="home-title font-sans leading-normal"
      >
        الأسئلة الوزارية حول أسماء الاستفهام "أي - كم" لقواعد اللغة العربية للصف السادس الإعدادي
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="home-subtitle"
      >
        تطبيق تفاعلي للتدريب المكثف والتقييم الذاتي الأكاديمي لضمان التفوق والحصول على الدرجة الكاملة في الامتحان الوزاري.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="home-steps-card"
      >
        <h3 className="home-steps-title font-sans">طريقة العمل المختصرة في المنصة:</h3>
        <ul className="home-steps-list">
          <li>
            <span className="home-steps-num">١</span>
            <span>اكتب جوابك الشخصي كاملاً وبكل أمانة في الحقل المخصص.</span>
          </li>
          <li>
            <span className="home-steps-num">٢</span>
            <span>اضغط على زر (أظهر الجواب النموذجي) للمقارنة الدقيقة مع المصدر.</span>
          </li>
          <li>
            <span className="home-steps-num">٣</span>
            <span>قيّم جوابك يا بطل بموضوعية واختر الدرجة المناسبة من (0 إلى 10).</span>
          </li>
          <li>
            <span className="home-steps-num">٤</span>
            <span>حدّد مستوى تمكنك من السؤال لمراجعة نقاط ضعفك لاحقاً بكل سهولة.</span>
          </li>
        </ul>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="home-stats-preview"
      >
        عدد الأسئلة الكلي في هذا التدريب: {totalQuestions} سؤالاً وزارياً.
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="home-actions"
      >
        <button
          id="cta-start-training"
          onClick={onStartTraining}
          className="btn btn-primary"
        >
          <GraduationCap className="h-5 w-5" />
          <span>ابدأ التدريب</span>
        </button>
      </motion.div>
    </div>
  );
}

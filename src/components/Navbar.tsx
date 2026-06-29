import { Sun, Moon, Home } from 'lucide-react';

interface NavbarProps {
  activeTab: "home" | "training" | "dashboard";
  setActiveTab: (tab: "home" | "training" | "dashboard") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }: NavbarProps) {
  return (
    <nav className="navbar">
      <div 
        className="brand" 
        id="nav-brand" 
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveTab("home")}
      >
        <img 
          className="brand-logo" 
          src="/madrasati_logo.png" 
          alt="منصة مدرسي" 
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.indexOf('.jpg') === -1) {
              target.src = '/madrasati_logo.jpg';
            } else {
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="100%" height="100%" fill="%235B2596"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-size="10" font-weight="bold">مدرسي</text></svg>';
            }
          }}
        />
        <span className="brand-name">منصة مدرسي</span>
      </div>
      
      <div className="nav-actions">
        {/* Back to home button (shown when activeTab is NOT home) */}
        {activeTab !== "home" && (
          <button 
            className="btn btn-secondary" 
            id="nav-home-btn" 
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-4.5 w-4.5" />
            <span>الرئيسية</span>
          </button>
        )}

        {/* Theme Switcher */}
        <button 
          className="btn btn-secondary btn-circle" 
          id="theme-toggle" 
          onClick={toggleTheme}
          title="تبديل الوضع الليلي والنهاري"
        >
          <span id="theme-icon">
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-[#5B2596]" />
            )}
          </span>
        </button>
      </div>
    </nav>
  );
}

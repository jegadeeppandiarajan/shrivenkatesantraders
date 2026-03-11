import { useTheme } from "../../context/ThemeContext";

const AnimatedBackground = () => {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${darkMode ? 'bg-dark-bg' : 'bg-stone-100'}`}
      ></div>

      {/* Copper accent glow */}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-[180px] transition-opacity duration-700 ${darkMode ? 'bg-brand-primary/5' : 'bg-brand-primary/8'} -top-32 -right-32`}></div>
      <div className={`absolute w-[400px] h-[400px] rounded-full blur-[150px] transition-opacity duration-700 ${darkMode ? 'bg-brand-secondary/3' : 'bg-brand-secondary/5'} bottom-1/4 -left-32`}></div>
    </div>
  );
};

export default AnimatedBackground;


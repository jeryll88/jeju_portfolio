import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Awards & Certificates', href: '#awards' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_ITEMS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none"
    >
      <div
        className="nav-pill max-w-5xl mx-auto rounded-full backdrop-blur-xl border shadow-xl dark:shadow-2xl px-4 sm:px-6 py-2 pointer-events-auto transition-all duration-300"
        style={{
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
        }}
      >
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
            className="flex items-center gap-2.5 group outline-none focus:outline-none focus:ring-0 select-none"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center group-hover:shadow-primary/50 transition-all flex-shrink-0">
              <img src="/logo.png" alt="Jeryll Anne" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="theme-text-primary font-bold text-sm md:text-base tracking-wider leading-tight group-hover:text-primary transition-colors">
                JERYLL ANNE
              </span>
              <span className="text-[9px] theme-text-accent font-mono tracking-widest uppercase leading-none">
                Portfolio
              </span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.slice(0, -1).map(({ label, href }) => (
              <motion.button
                key={href}
                onClick={() => scrollTo(href)}
                className={`relative px-3 py-1.5 text-xs font-semibold transition-colors rounded-full ${
                  active === href.slice(1)
                    ? 'text-blue-700 dark:text-cyan-300 bg-primary/15'
                    : 'text-slate-700 hover:text-slate-950 dark:text-gray-200 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {/* Right Actions: Dark/Light Mode Toggle + Contact Button */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.12, rotate: isDark ? 20 : -20 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/15 outline-none shadow-sm cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <Sun size={17} className="text-amber-400 fill-amber-400/25" />
              ) : (
                <Moon size={16} className="text-slate-700 fill-slate-700/20" />
              )}
            </motion.button>

            {/* Contact Button */}
            <motion.button
              onClick={() => scrollTo('#contact')}
              className="px-4 py-1.5 bg-primary hover:bg-primary-600 text-white text-xs font-bold rounded-full transition-all shadow-md shadow-primary/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-slate-700 dark:text-amber-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Toggle Menu */}
            <button
              className="text-slate-800 dark:text-white p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden pt-2 pb-3 border-t border-slate-200/60 dark:border-white/5 mt-2"
            >
              <div className="space-y-1">
                {NAV_ITEMS.map(({ label, href }) => (
                  <button
                    key={href}
                    onClick={() => scrollTo(href)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active === href.slice(1)
                        ? 'text-blue-700 dark:text-cyan-300 bg-primary/15'
                        : 'text-slate-700 dark:text-gray-200 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

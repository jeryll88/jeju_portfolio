import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import TechLogo from '../components/TechLogo';
import { useTheme } from '../hooks/useTheme';

export default function SkillsSection() {
  const [categories, setCategories] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    api.skills.getPublished()
      .then((r) => {
        setCategories(r.data.categories || []);
      })
      .catch(() => {});
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Helper to ensure enough duplicated items for an unbroken infinite marquee
  // Creates two perfectly identical halves so translate3d(-50%, 0, 0) loops seamlessly
  const getLoopSkills = (skills = []) => {
    if (!skills || skills.length === 0) return [];
    let base = [...skills];
    while (base.length < 10) {
      base = [...base, ...skills];
    }
    return [...base, ...base];
  };

  return (
    <section
      id="skills"
      className="relative py-20 md:py-28 overflow-hidden transition-colors duration-300 w-full"
    >
      {/* Ambient background energy lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Section Title Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 theme-text-accent text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={14} className="theme-text-accent" />
            <span>Core Competencies & Stack</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold theme-text-primary tracking-tight mb-3">
            Technical Skills & Tools
          </h2>
          <p className="theme-text-muted text-sm md:text-base max-w-xl mx-auto">
            Continuously evolving toolchain and technologies I work with to build scalable IT applications.
          </p>
        </motion.div>
      </div>

      {/* ── Expanded Marquee Categories Container (Broad Left-to-Right Visibility) ───── */}
      <div className="relative w-full max-w-[96rem] 2xl:max-w-[104rem] mx-auto px-2 sm:px-4 z-10 space-y-12 md:space-y-14">
        {categories.map((cat, idx) => {
          const isReverse = idx % 2 === 1;
          const loopList = getLoopSkills(cat.skills || []);

          return (
            <motion.div
              key={cat.id || idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              className="space-y-4"
            >
              {/* Category Header */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight theme-text-primary">
                  {cat.name}
                </h3>
              </div>

              {/* ── Wide Continuous Moving Stream (No Obstructive Edge Gradients) ─────── */}
              <div className="relative w-full overflow-hidden py-2.5">
                {/* Moving Track */}
                <div
                  className={`${
                    isReverse ? 'marquee-track-right' : 'marquee-track-left'
                  } gap-4 sm:gap-5 cursor-pointer`}
                >
                  {loopList.map((skill, sIdx) => {
                    return (
                      <div
                        key={`${skill.id || skill.name}-${sIdx}`}
                        className="skill-pill group flex items-center justify-center gap-3 min-w-[140px] sm:min-w-[155px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full 
                          border 
                          hover:border-blue-400/70 dark:hover:border-cyan-400/80 
                          shadow-[0_4px_14px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_22px_rgba(15,23,42,0.12)] 
                          dark:shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.14)] 
                          dark:hover:shadow-[0_0_22px_rgba(34,211,238,0.35)] 
                          transition-all duration-300 hover:scale-105 flex-shrink-0 cursor-pointer"
                        style={{
                          backgroundColor: isDark ? '#000000' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.12)',
                        }}
                      >
                        {/* Official Tech Logo */}
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                          <TechLogo
                            name={skill.name}
                            logoUrl={skill.logoUrl}
                            className="w-6 h-6 object-contain"
                            onDarkSurface={isDark}
                          />
                        </div>

                        {/* Tech Name */}
                        <span
                          className="text-sm sm:text-[15px] font-semibold tracking-wide whitespace-nowrap transition-colors"
                          style={{
                            color: isDark ? '#FFFFFF' : '#0F172A',
                          }}
                        >
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

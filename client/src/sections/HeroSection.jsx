import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Github, Linkedin, Facebook, Mail, ExternalLink } from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '../data/portfolio';

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, facebook: Facebook, email: Mail };

export default function HeroSection() {
  const profile = PROFILE;
  const socials = SOCIAL_LINKS;
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullName = (profile?.fullName || 'JERYLL ANNE BIDES').toUpperCase();

  useEffect(() => {
    let timeout;
    if (!isDeleting && displayText.length < fullName.length) {
      timeout = setTimeout(() => setDisplayText(fullName.slice(0, displayText.length + 1)), 160);
    } else if (!isDeleting && displayText.length === fullName.length) {
      timeout = setTimeout(() => setIsDeleting(true), 4000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => setDisplayText(fullName.slice(0, displayText.length - 1)), 70);
    } else if (isDeleting && displayText.length === 0) {
      timeout = setTimeout(() => setIsDeleting(false), 600);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, fullName]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="home" className="min-h-screen flex items-center section-padding pt-24 md:pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <motion.p variants={item} className="text-blue-700 dark:text-cyan-400 font-semibold tracking-wide mb-2 flex items-center gap-2 text-sm sm:text-base transition-colors">
              <span>👋 Hello, I'm</span>
            </motion.p>

            {/* Full Name Typewriter */}
            <motion.h1 variants={item} className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[3.15rem] font-extrabold mb-4 leading-tight min-h-[2.8rem] sm:min-h-[3.6rem] lg:min-h-[4.2rem] flex items-center whitespace-nowrap overflow-visible">
              <span
                className="whitespace-nowrap tracking-tight font-extrabold"
                style={{
                  backgroundImage: 'var(--hero-name-gradient)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                {displayText}
              </span>
              <span className="text-blue-600 dark:text-cyan-400 ml-1 animate-pulse font-light">|</span>
            </motion.h1>

            <motion.div variants={item} className="mb-6">
              <span className="text-lg md:text-xl text-blue-700 dark:text-cyan-400 font-mono font-semibold tracking-wide transition-colors">
                {profile?.professionalTitle || 'Information Technology Student | Aspiring Web Developer'}
              </span>
            </motion.div>

            <motion.p variants={item} className="theme-text-secondary text-lg mb-4 max-w-lg leading-relaxed font-normal">
              {profile?.introduction || 'Welcome to my portfolio.'}
            </motion.p>
            {profile?.tagline && (
              <motion.p variants={item} className="theme-text-muted italic mb-8 text-sm font-medium">"{profile.tagline}"</motion.p>
            )}

            {/* Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-8">
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 font-semibold">
                  <Download size={18} /> Download Resume
                </a>
              )}
              <button onClick={() => scrollTo('projects')} className="px-6 py-3 border-2 border-primary text-blue-700 dark:text-blue-400 hover:bg-primary hover:text-white dark:hover:text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-sm">
                View My Projects <ArrowRight size={18} />
              </button>
              <button onClick={() => scrollTo('contact')} className="px-6 py-3 bg-cyan-600/15 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-600/25 dark:hover:bg-cyan-500/25 border border-cyan-600/40 dark:border-cyan-400/30 font-semibold rounded-lg transition-all shadow-sm">
                Contact Me
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={item} className="flex gap-3">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || ExternalLink;
                return (
                  <motion.a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-primary/20 flex items-center justify-center text-slate-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-all border border-slate-300/80 dark:border-white/10 hover:border-primary/30"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div variants={item} className="order-1 lg:order-2 flex justify-center">
            <div className="relative group">
              {/* Ambient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-accent to-blue-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-700 animate-pulse-slow" />

              {/* Portrait Card */}
              <div className="relative w-72 sm:w-80 aspect-[3/4] rounded-3xl p-2.5 bg-white/85 dark:bg-[#111827]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-primary/20">
                <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10">
                  <img
                    src={profile?.profileImageUrl || '/profile.jpg'}
                    alt={profile?.fullName || 'Portfolio Owner'}
                    className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = '/profile.jpg'; }}
                  />
                  {/* Lower gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 dark:from-[#080C14]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Status Pill */}
                  <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2.5 bg-white/95 dark:bg-[#080C14]/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-white/10 shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                        {profile?.fullName || 'Portfolio Owner'}
                      </p>
                      <p className="text-[10px] text-cyan-700 dark:text-cyan-300 font-semibold mt-1 leading-none">
                        IT Web Developer
                      </p>
                    </div>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

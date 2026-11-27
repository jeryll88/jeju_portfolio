import { motion } from 'framer-motion';
import { Globe, Smartphone, Sparkles, FolderGit2, Award, ArrowRight, Mail } from 'lucide-react';
import { PROFILE, ABOUT, PROJECTS, AWARDS } from '../data/portfolio';
import TechOrbit from '../components/TechOrbit';
import { useTheme } from '../hooks/useTheme';

export default function AboutSection() {
  const { isDark } = useTheme();
  const about = ABOUT;
  const profile = PROFILE;
  const stats = {
    projects: PROJECTS.length,
    certificates: AWARDS.length,
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const statItems = [
    {
      label: 'Projects',
      value: `${stats.projects}+`,
      desc: 'Web & Mobile Apps',
      icon: FolderGit2,
      color: isDark ? '#38BDF8' : '#2563EB',
      bg: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(37, 99, 235, 0.1)',
    },
    {
      label: 'Certificates',
      value: `${stats.certificates}+`,
      desc: 'Awards & Honors',
      icon: Award,
      color: isDark ? '#FBBF24' : '#D97706',
      bg: isDark ? 'rgba(251, 191, 36, 0.15)' : 'rgba(217, 119, 6, 0.1)',
    },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold theme-text-accent mb-3">
            <Sparkles size={12} className="text-primary animate-pulse" />
            <span>DISCOVER MY JOURNEY</span>
          </div>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know my journey, skills, and aspirations</p>
        </motion.div>

        {/* Main Content Grid: Tech Orbit (Left) & Introduction (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Tech Orbit Interactive System */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center order-1 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <TechOrbit
              profileImageUrl={profile?.profileImageUrl}
              fullName={profile?.fullName}
            />
          </motion.div>

          {/* Introduction & Highlights Column */}
          <motion.div
            className="lg:col-span-7 space-y-6 order-2 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {/* Role & Specialization Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 shadow-sm">
                <Globe size={13} className="text-blue-500" />
                Web Developer
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 shadow-sm">
                <Smartphone size={13} className="text-purple-500" />
                Mobile Developer
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm">
                <Sparkles size={13} className="text-emerald-500" />
                BSIT 4th Year
              </span>
            </div>

            {/* Headline */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold theme-text-primary leading-tight">
                Turning Ideas into Practical, Engaging Digital Experiences
              </h3>
              <p className="text-sm font-medium text-blue-700 dark:text-cyan-400 mt-1 transition-colors">
                {profile?.fullName || 'Jeryll Anne Bides'} • {profile?.professionalTitle || 'Aspiring Web & Mobile Developer'}
              </p>
            </div>

            {/* Biography Card */}
            <div className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 rounded-2xl shadow-sm dark:shadow-none space-y-4">
              {about.biography.split('\n\n').map((paragraph, index) => (
                <p key={index} className="theme-text-secondary leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Project & Certificate Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {statItems.map((stat, idx) => (
                <div
                  key={idx}
                  className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-4 rounded-xl shadow-sm dark:shadow-none hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
                      style={{ backgroundColor: stat.bg, color: stat.color }}
                    >
                      <stat.icon size={20} />
                    </div>
                    <span
                      className="text-3xl font-extrabold font-mono tracking-tight transition-colors"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <h4
                    className="text-xs font-bold uppercase tracking-wider transition-colors"
                    style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
                  >
                    {stat.label}
                  </h4>
                  <p
                    className="text-[11px] mt-0.5 transition-colors"
                    style={{ color: isDark ? '#94A3B8' : '#64748B' }}
                  >
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollTo('projects')}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/35"
              >
                <span>View Projects</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/90 dark:border-white/10 theme-text-primary text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <Mail size={15} className="text-primary dark:text-cyan-400" />
                <span>Contact Me</span>
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

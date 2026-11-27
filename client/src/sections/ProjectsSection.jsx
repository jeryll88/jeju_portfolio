import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ExternalLink, Github, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProjectModal from '../components/ProjectModal';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const isAutoScrolling = true;

  const containerRef = useRef(null);
  const set1Ref = useRef(null);
  const singleSetWidthRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);
  const isHovered = useRef(false);
  const animFrameId = useRef(null);

  useEffect(() => {
    api.projects.getPublished().then((r) => {
      setProjects(r.data?.projects || []);
    }).catch(() => {});
  }, []);

  // Ensure base has at least 4 items so that wide screens have sufficient cards
  const baseList = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    let list = [...projects];
    while (list.length < 4) {
      list = [...list, ...projects];
    }
    return list;
  }, [projects]);

  // Measure single set width after mount and on resize
  const measureWidth = () => {
    if (set1Ref.current) {
      // 24px is gap-6 in Tailwind
      singleSetWidthRef.current = set1Ref.current.offsetWidth + 24;
    }
  };

  useEffect(() => {
    if (baseList.length === 0) return;

    // Small delay to ensure DOM dimensions have rendered
    const timer = setTimeout(() => {
      measureWidth();
      if (containerRef.current && singleSetWidthRef.current > 0) {
        // Start centered in Set 2 (middle copy)
        containerRef.current.scrollLeft = singleSetWidthRef.current;
      }
    }, 150);

    const onResize = () => measureWidth();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [baseList]);

  // Seamless circular wrapping when user or auto-scroll reaches bounds
  const handleScroll = () => {
    if (!containerRef.current || singleSetWidthRef.current <= 0) return;
    const w = singleSetWidthRef.current;
    const current = containerRef.current.scrollLeft;

    // Scrolled past Set 2 into Set 3 -> wrap silently back by -w
    if (current >= w * 2) {
      containerRef.current.scrollLeft = current - w;
    }
    // Scrolled back before Set 2 into Set 1 -> wrap silently forward by +w
    else if (current <= 10) {
      containerRef.current.scrollLeft = current + w;
    }
  };

  // Smooth continuous auto-scroll loop (60fps)
  useEffect(() => {
    if (baseList.length === 0) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lastTime = performance.now();

    const loop = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (
        isAutoScrolling &&
        !isHovered.current &&
        !isDragging.current &&
        containerRef.current &&
        singleSetWidthRef.current > 0
      ) {
        // Slow gentle glide: ~28px per second
        const speed = (28 * delta) / 1000;
        containerRef.current.scrollLeft += speed;
      }
      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [baseList, isAutoScrolling]);

  // Horizontal mouse wheel scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 0.85;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Mouse Drag Interactions
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (project) => {
    if (hasDragged.current) return;
    setSelectedProject(project);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Reusable card renderer
  const renderCard = (project, uniqueKey) => (
    <div
      key={uniqueKey}
      onClick={() => handleCardClick(project)}
      className="glass bg-white dark:bg-[#111827]/90 border border-slate-200/90 dark:border-white/10 hover:border-primary/60 dark:hover:border-cyan-400/50 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl dark:shadow-none dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1.5 w-[300px] sm:w-[340px] md:w-[370px] lg:w-[390px] flex-shrink-0 select-none"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-[#0D1322]">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-4xl font-bold text-slate-400 dark:text-white/20">{project.title?.[0] || 'P'}</span>
          </div>
        )}

        {project.isFeatured && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/95 text-black text-xs font-bold rounded-lg flex items-center gap-1 shadow-md">
            <Star size={11} className="fill-black" />
            <span>Featured</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm ${
            project.status === 'Completed'
              ? 'bg-emerald-500/90 text-white dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'bg-blue-500/90 text-white dark:bg-blue-500/20 dark:text-blue-400'
          }`}>
            {project.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-cyan-400 transition-colors">
            {project.category || 'Web Development'}
          </span>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:text-primary dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/15 transition-all"
                title="View GitHub repository"
              >
                <Github size={12} />
                <span>Code</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/25 px-2.5 py-1 rounded-full border border-cyan-500/30 transition-all"
                title="Open live website"
              >
                <ExternalLink size={12} />
                <span>Demo</span>
              </a>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 theme-text-primary group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="theme-text-muted text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.shortDesc || project.fullDesc || 'Explore project details and architecture.'}
        </p>

        {/* Technologies tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies?.split(',').slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 rounded-lg border border-slate-200/80 dark:border-white/10 transition-colors"
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="max-w-[96rem] 2xl:max-w-[104rem] mx-auto w-full px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold theme-text-accent mb-3">
            <Sparkles size={12} className="text-primary animate-pulse" />
            <span>PORTFOLIO SHOWCASE</span>
          </div>
          <h2 className="section-title">My Projects</h2>
          <p className="section-subtitle">
            Explore my featured web applications, systems, and software developments.
          </p>
        </motion.div>

        {/* ── Circular Carousel Container ── */}
        {projects.length === 0 ? (
          <p className="theme-text-muted text-center italic py-12">No projects found.</p>
        ) : (
          <div className="relative">
            {/* Scrollable Track */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                isHovered.current = false;
                isDragging.current = false;
              }}
              onMouseEnter={() => {
                isHovered.current = true;
              }}
              onTouchStart={() => {
                isDragging.current = true;
              }}
              onTouchEnd={() => {
                isDragging.current = false;
              }}
              className="flex gap-6 overflow-x-scroll py-4 px-1 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Set 1: Left Buffer */}
              <div ref={set1Ref} className="flex gap-6 flex-shrink-0">
                {baseList.map((p, idx) => renderCard(p, `set1-${p.id || idx}-${idx}`))}
              </div>

              {/* Set 2: Active Middle Set */}
              <div className="flex gap-6 flex-shrink-0">
                {baseList.map((p, idx) => renderCard(p, `set2-${p.id || idx}-${idx}`))}
              </div>

              {/* Set 3: Right Buffer */}
              <div className="flex gap-6 flex-shrink-0">
                {baseList.map((p, idx) => renderCard(p, `set3-${p.id || idx}-${idx}`))}
              </div>
            </div>
          </div>
        )}

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

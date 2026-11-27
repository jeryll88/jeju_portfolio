import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ProjectModal({ project, onClose }) {
  const [fullProject, setFullProject] = useState(project);
  const [currentImage, setCurrentImage] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  const images = fullProject.images || [];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border transition-colors duration-200"
        style={{
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
          color: isDark ? '#FFFFFF' : '#0F172A',
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Image Gallery */}
        {(fullProject.thumbnailUrl || images.length > 0) && (
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl bg-black">
            <img
              src={images.length > 0 ? images[currentImage]?.imageUrl : fullProject.thumbnailUrl}
              alt={fullProject.title}
              className="w-full h-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage((p) => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setCurrentImage((p) => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white">
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-primary w-4' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs text-blue-700 dark:text-cyan-400 font-semibold tracking-wide uppercase transition-colors">{fullProject.category}</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-1" style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{fullProject.title}</h2>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              fullProject.status === 'Completed'
                ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
            }`}>{fullProject.status}</span>
          </div>

          {fullProject.fullDesc && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Description</h3>
              <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base font-normal" style={{ color: isDark ? '#E2E8F0' : '#334155' }}>{fullProject.fullDesc}</p>
            </div>
          )}
          {fullProject.objectives && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Objectives</h3>
              <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base font-normal" style={{ color: isDark ? '#E2E8F0' : '#334155' }}>{fullProject.objectives}</p>
            </div>
          )}
          {fullProject.features && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Features</h3>
              <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base font-normal" style={{ color: isDark ? '#E2E8F0' : '#334155' }}>{fullProject.features}</p>
            </div>
          )}
          {fullProject.role && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>My Role</h3>
              <p className="text-sm sm:text-base font-normal" style={{ color: isDark ? '#E2E8F0' : '#334155' }}>{fullProject.role}</p>
            </div>
          )}

          {/* Technologies */}
          {fullProject.technologies && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {fullProject.technologies.split(',').map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border transition-colors"
                    style={{
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)',
                      borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                      color: isDark ? '#60A5FA' : '#1D4ED8',
                    }}
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div
            className="flex gap-3 pt-4 border-t"
            style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }}
          >
            {fullProject.githubUrl && (
              <a href={fullProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2 text-sm"><Github size={16} /> GitHub</a>
            )}
            {fullProject.liveDemoUrl && (
              <a href={fullProject.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 text-sm"><ExternalLink size={16} /> Live Demo</a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

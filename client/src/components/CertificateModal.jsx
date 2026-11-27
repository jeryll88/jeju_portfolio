import { motion } from 'framer-motion';
import { X, Award, Building2, Calendar, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function CertificateModal({ award, onClose }) {
  const { isDark } = useTheme();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 max-w-3xl w-full border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-200"
        style={{
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
          color: isDark ? '#FFFFFF' : '#0F172A',
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
          <X size={16} />
        </button>

        {/* Preview: PDF or Image */}
        {award.imageUrl?.toLowerCase().endsWith('.pdf') ? (
          <div className="h-[60vh] w-full bg-black flex flex-col">
            <iframe
              src={award.imageUrl}
              title={award.title || 'Certificate'}
              className="w-full h-full border-0 rounded-t-2xl"
            />
          </div>
        ) : award.imageUrl ? (
          <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-black">
            <img src={award.imageUrl} alt={award.title || 'Certificate'} className="max-w-full max-h-[60vh] object-contain" />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <Award size={64} className="text-primary/30" />
          </div>
        )}

        {/* Details */}
        <div className="p-6">
          {award.title && (
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
            >
              {award.title}
            </h2>
          )}
          <div
            className="flex flex-wrap gap-4 text-sm mb-4"
            style={{ color: isDark ? '#94A3B8' : '#64748B' }}
          >
            {award.organization && (
              <span className="flex items-center gap-1.5">
                <Building2 size={14} className="text-primary" /> {award.organization}
              </span>
            )}
            {award.dateReceived && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" /> {award.dateReceived}
              </span>
            )}
          </div>
          {award.description && (
            <p
              className="leading-relaxed text-sm sm:text-base font-normal whitespace-pre-line"
              style={{ color: isDark ? '#E2E8F0' : '#334155' }}
            >
              {award.description}
            </p>
          )}
          {award.verificationLink && (
            <a
              href={award.verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors"
              style={{
                borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : '#3B82F6',
                color: isDark ? '#60A5FA' : '#1D4ED8',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              }}
            >
              <ExternalLink size={14} /> Verify Certificate
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

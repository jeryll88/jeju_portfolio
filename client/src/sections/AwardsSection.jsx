import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, Building2, ExternalLink } from 'lucide-react';
import api from '../services/api';
import CertificateModal from '../components/CertificateModal';

export default function AwardsSection() {
  const [awards, setAwards] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.awards.getPublished().then((r) => setAwards(r.data.awards || [])).catch(() => { });
  }, []);

  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="awards" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="section-title">Awards & Certificates</h2>
          <p className="section-subtitle">Recognition and achievements</p>
        </motion.div>

        {awards.length === 0 ? (
          <p className="theme-text-muted text-center italic">No awards or certificates yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, i) => (
              <motion.div
                key={award.id}
                className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 hover:border-primary/50 overflow-hidden group cursor-pointer transition-all shadow-md dark:shadow-none"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(award)}
              >
                {/* Certificate Image / PDF Preview */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-[#0D1322]">
                  {award.imageUrl?.toLowerCase().endsWith('.pdf') ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#049FD9]/15 via-primary/10 to-slate-100 dark:to-[#111827] flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform duration-500 border-b border-primary/20">
                      <div className="w-12 h-12 rounded-xl bg-[#049FD9]/20 border border-[#049FD9]/30 flex items-center justify-center mb-2 shadow-lg shadow-[#049FD9]/10">
                        <Award size={26} className="text-[#049FD9]" />
                      </div>
                      <span className="text-xs font-semibold theme-text-primary tracking-wide">Cisco Networking Academy</span>
                      <span className="text-[10px] theme-text-accent mt-0.5 font-mono">PDF Certificate • Click to Preview</span>
                    </div>
                  ) : award.imageUrl ? (
                    <img src={award.imageUrl} alt={award.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <Award size={48} className="text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 dark:from-[#080C14]/50 via-transparent opacity-40 dark:opacity-60 pointer-events-none" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 theme-text-primary group-hover:text-primary transition-colors">{award.title}</h3>
                  {award.organization && (
                    <p className="text-sm theme-text-muted flex items-center gap-1.5 mb-1">
                      <Building2 size={14} className="text-primary/70 flex-shrink-0" /> {award.organization}
                    </p>
                  )}
                  {award.dateReceived && (
                    <p className="text-sm theme-text-muted flex items-center gap-1.5 mb-3">
                      <Calendar size={14} className="text-primary/70 flex-shrink-0" /> {award.dateReceived}
                    </p>
                  )}
                  {award.description && (
                    <p className="text-sm theme-text-secondary line-clamp-2 leading-relaxed">{award.description}</p>
                  )}
                  {award.verificationLink && (
                    <a href={award.verificationLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-blue-700 dark:text-blue-400 hover:underline mt-3 transition-colors">
                      <ExternalLink size={12} /> Verify
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selected && <CertificateModal award={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

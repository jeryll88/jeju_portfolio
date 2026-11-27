import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function AdminModal({ isOpen, onClose, title, size = 'md', children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className={`relative z-10 ${SIZES[size]} w-full bg-white dark:bg-dark-50 border border-slate-200 dark:border-white/10 rounded-2xl max-h-[85vh] overflow-y-auto`}
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
        >
          <div className="sticky top-0 bg-white dark:bg-dark-50 border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

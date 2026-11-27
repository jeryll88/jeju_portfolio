import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, message = 'Are you sure?', danger = true }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <motion.div className="relative z-10 bg-white dark:bg-dark-50 border border-slate-200 dark:border-white/10 rounded-xl p-6 max-w-sm w-full" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          <div className="flex items-start gap-3 mb-5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-500/10' : 'bg-primary/10'}`}>
              <AlertTriangle size={20} className={danger ? 'text-red-400' : 'text-primary'} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Confirm Action</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm bg-slate-200/80 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-lg transition-colors">Cancel</button>
            <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary-600 text-white'}`}>
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

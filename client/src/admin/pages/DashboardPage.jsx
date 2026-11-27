import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Wrench, Award, Mail, Plus, Eye, ArrowRight, MailOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    api.dashboard.getStats().then((r) => setStats(r.data.stats)).catch(() => {});
    api.dashboard.getRecent().then((r) => setRecent(r.data)).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Projects', value: stats?.totalProjects ?? 0, icon: FolderOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Skills', value: stats?.totalSkills ?? 0, icon: Wrench, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Awards', value: stats?.totalAwards ?? 0, icon: Award, color: 'from-purple-500 to-purple-600' },
    { label: 'Messages', value: stats?.totalMessages ?? 0, icon: Mail, color: 'from-green-500 to-green-600', badge: stats?.unreadMessages },
  ];

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" variants={container} initial="hidden" animate="visible">
        {statCards.map(({ label, value, icon: Icon, color, badge }) => (
          <motion.div key={label} variants={item} className="glass p-5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-5 -translate-y-1/2 translate-x-1/2`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{label}</p>
                <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                <Icon size={22} className="text-white" />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">{badge}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass p-6">
          <h2 className="font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center"><Plus size={16} className="text-blue-400" /></div>
              <span className="text-sm text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">Add New Project</span>
              <ArrowRight size={14} className="ml-auto text-slate-400 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white" />
            </Link>
            <Link to="/admin/skills" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center"><Plus size={16} className="text-cyan-400" /></div>
              <span className="text-sm text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">Add New Skill</span>
              <ArrowRight size={14} className="ml-auto text-slate-400 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white" />
            </Link>
            <Link to="/admin/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center"><Eye size={16} className="text-green-400" /></div>
              <span className="text-sm text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">View Messages</span>
              <ArrowRight size={14} className="ml-auto text-slate-400 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass p-6">
          <h2 className="font-semibold mb-4 text-slate-900 dark:text-white">Recent Messages</h2>
          {!recent?.recentMessages?.length ? (
            <p className="text-slate-400 dark:text-gray-500 text-sm italic">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.isRead ? 'bg-gray-500' : 'bg-primary'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-slate-800 dark:text-white">{msg.name} — {msg.subject}</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

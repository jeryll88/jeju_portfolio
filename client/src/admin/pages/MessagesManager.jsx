import { useState, useEffect } from 'react';
import { Trash2, Mail, MailOpen, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [sort, setSort] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadData(); }, [sort]);

  const loadData = async () => {
    try { const r = await api.contact.getAll({ sort }); setMessages(r.data.messages || []); } catch {}
  };

  const toggleRead = async (msg) => {
    try { await api.contact.toggleRead(msg.id); loadData(); } catch {}
  };

  const deleteMsg = async () => {
    try { await api.contact.delete(deleteId); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  const viewMessage = async (msg) => {
    try {
      const r = await api.contact.getOne(msg.id);
      setSelected(r.data.message);
      if (!msg.isRead) { await api.contact.toggleRead(msg.id); loadData(); }
    } catch {}
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary">Messages</h1>
          {unread > 0 && <p className="text-sm text-blue-700 dark:text-blue-400">{unread} unread message{unread > 1 ? 's' : ''}</p>}
        </div>
        <button onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-sm theme-text-secondary transition-colors">
          <ArrowUpDown size={14} /> {sort === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="glass p-12 text-center">
          <Mail size={48} className="mx-auto theme-text-muted mb-4" />
          <p className="theme-text-muted italic">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => viewMessage(msg)}
              className={`glass p-4 cursor-pointer hover:border-primary/20 transition-all flex items-start gap-3 ${!msg.isRead ? 'border-l-2 border-l-primary' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.isRead ? 'bg-slate-400 dark:bg-gray-600' : 'bg-primary'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium truncate ${!msg.isRead ? 'theme-text-primary font-semibold' : 'theme-text-secondary'}`}>{msg.name}</p>
                  <span className="text-xs theme-text-muted flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm theme-text-secondary truncate">{msg.subject}</p>
                <p className="text-xs theme-text-muted truncate mt-0.5">{msg.email}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={(e) => { e.stopPropagation(); toggleRead(msg); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title={msg.isRead ? 'Mark unread' : 'Mark read'}>
                  {msg.isRead ? <Mail size={14} className="theme-text-muted" /> : <MailOpen size={14} className="text-primary" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }} className="p-1.5 hover:bg-red-500/10 rounded">
                  <Trash2 size={14} className="text-red-500 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs theme-text-muted mb-1">From</p><p className="text-sm font-medium theme-text-primary">{selected.name}</p></div>
              <div><p className="text-xs theme-text-muted mb-1">Email</p><a href={`mailto:${selected.email}`} className="text-sm text-blue-700 dark:text-blue-400 hover:underline">{selected.email}</a></div>
            </div>
            <div><p className="text-xs theme-text-muted mb-1">Subject</p><p className="text-sm font-medium theme-text-primary">{selected.subject}</p></div>
            <div><p className="text-xs theme-text-muted mb-1">Date</p><p className="text-sm theme-text-secondary">{new Date(selected.createdAt).toLocaleString()}</p></div>
            <div className="pt-3 border-t border-slate-200 dark:border-white/5">
              <p className="text-xs theme-text-muted mb-2">Message</p>
              <p className="text-sm theme-text-secondary whitespace-pre-line leading-relaxed">{selected.message}</p>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteMsg} message="Delete this message?" />
    </div>
  );
}

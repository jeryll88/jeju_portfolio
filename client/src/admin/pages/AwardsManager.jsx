import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';

export default function AwardsManager() {
  const [awards, setAwards] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', organization: '', dateReceived: '', description: '', verificationLink: '', isPublished: true });
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const r = await api.awards.getAll(); setAwards(r.data.awards || []); } catch {}
  };

  const openForm = (a = null) => {
    if (a) {
      setEditing(a.id);
      setForm({ title: a.title, organization: a.organization || '', dateReceived: a.dateReceived || '', description: a.description || '', verificationLink: a.verificationLink || '', isPublished: a.isPublished });
    } else {
      setEditing(null);
      setForm({ title: '', organization: '', dateReceived: '', description: '', verificationLink: '', isPublished: true });
    }
    setImageFile(null);
    setModal(true);
  };

  const saveAward = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editing) { await api.awards.update(editing, fd); toast.success('Updated!'); }
      else { await api.awards.create(fd); toast.success('Created!'); }
      setModal(false);
      loadData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const deleteAward = async () => {
    try { await api.awards.delete(deleteId); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  const input = "w-full px-4 py-2.5 theme-input";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold theme-text-primary">Awards & Certificates</h1>
        <button onClick={() => openForm()} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Award</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {awards.map((a) => (
          <div key={a.id} className="glass overflow-hidden">
            <div className="h-36 bg-slate-100 dark:bg-[#0D1322] overflow-hidden">
              {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20 text-4xl font-bold">🏆</div>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm theme-text-primary">{a.title}</h3>
                {a.isPublished ? <Eye size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" /> : <EyeOff size={14} className="theme-text-muted flex-shrink-0" />}
              </div>
              <p className="text-xs theme-text-muted">{a.organization} {a.dateReceived && `· ${a.dateReceived}`}</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => openForm(a)} className="flex-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 theme-text-secondary rounded text-xs flex items-center justify-center gap-1 transition-colors"><Pencil size={12} /> Edit</button>
                <button onClick={() => setDeleteId(a.id)} className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-xs text-red-500 dark:text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {awards.length === 0 && <p className="theme-text-muted text-center py-12 italic">No awards or certificates yet.</p>}

      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Award' : 'Add Award'} size="lg">
        <div className="space-y-4">
          <div><label className="block text-sm theme-label mb-1.5">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm theme-label mb-1.5">Organization</label><input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className={input} /></div>
            <div><label className="block text-sm theme-label mb-1.5">Date Received</label><input type="text" value={form.dateReceived} onChange={(e) => setForm({ ...form, dateReceived: e.target.value })} className={input} placeholder="e.g. March 2025" /></div>
          </div>
          <div><label className="block text-sm theme-label mb-1.5">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} resize-none`} /></div>
          <div><label className="block text-sm theme-label mb-1.5">Verification Link (optional)</label><input type="url" value={form.verificationLink} onChange={(e) => setForm({ ...form, verificationLink: e.target.value })} className={input} /></div>
          <ImageUpload currentImage={editing ? awards.find((a) => a.id === editing)?.imageUrl : null} onChange={setImageFile} label="Certificate Image" />
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-primary" /><span className="text-sm theme-label">Published</span></label>
          <button onClick={saveAward} className="btn-primary w-full">{editing ? 'Update' : 'Add'} Award</button>
        </div>
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteAward} message="Delete this award?" />
    </div>
  );
}

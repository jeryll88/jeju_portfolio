import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Image as ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';

const CATEGORIES = ['Web Development', 'Database Management', 'Data Analytics', 'UI/UX Design', 'Academic Projects'];
const STATUSES = ['In Progress', 'Completed', 'On Hold'];

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [imgModal, setImgModal] = useState(null);
  const [form, setForm] = useState({ title: '', shortDesc: '', fullDesc: '', objectives: '', features: '', category: 'Web Development', technologies: '', role: '', githubUrl: '', liveDemoUrl: '', status: 'In Progress', isFeatured: false, isPublished: true });
  const [thumbnail, setThumbnail] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [screenshots, setScreenshots] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const r = await api.projects.getAll(); setProjects(r.data.projects || []); } catch {}
  };

  const openForm = (p = null) => {
    if (p) {
      setEditing(p.id);
      setForm({ title: p.title, shortDesc: p.shortDesc || '', fullDesc: p.fullDesc || '', objectives: p.objectives || '', features: p.features || '', category: p.category, technologies: p.technologies || '', role: p.role || '', githubUrl: p.githubUrl || '', liveDemoUrl: p.liveDemoUrl || '', status: p.status, isFeatured: p.isFeatured, isPublished: p.isPublished });
    } else {
      setEditing(null);
      setForm({ title: '', shortDesc: '', fullDesc: '', objectives: '', features: '', category: 'Web Development', technologies: '', role: '', githubUrl: '', liveDemoUrl: '', status: 'In Progress', isFeatured: false, isPublished: true });
    }
    setThumbnail(null);
    setModal(true);
  };

  const saveProject = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    try {
      if (editing) { await api.projects.update(editing, fd); toast.success('Updated!'); }
      else { await api.projects.create(fd); toast.success('Created!'); }
      setModal(false);
      loadData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const deleteProject = async () => {
    try { await api.projects.delete(deleteId); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  const uploadScreenshots = async () => {
    if (!screenshots || !imgModal) return;
    const fd = new FormData();
    for (const f of screenshots) fd.append('images', f);
    try { await api.projects.uploadImages(imgModal.id, fd); toast.success('Uploaded!'); loadData(); setScreenshots(null); } catch { toast.error('Upload failed'); }
  };

  const deleteImage = async (projectId, imageId) => {
    try { await api.projects.deleteImage(projectId, imageId); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
  };

  const input = "w-full px-4 py-2.5 theme-input";
  const textarea = `${input} resize-none`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold theme-text-primary">Projects Manager</h1>
        <button onClick={() => openForm()} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Project</button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="glass overflow-hidden">
            <div className="h-32 bg-slate-100 dark:bg-[#0D1322] overflow-hidden">
              {p.thumbnailUrl ? <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/5"><ImageIcon size={32} className="text-primary/20" /></div>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm theme-text-primary">{p.title}</h3>
                  <p className="text-xs theme-text-muted">{p.category}</p>
                </div>
                <div className="flex gap-1">
                  {p.isFeatured && <Star size={14} className="text-yellow-500 dark:text-yellow-400 fill-yellow-400" />}
                  {p.isPublished ? <Eye size={14} className="text-green-600 dark:text-green-400" /> : <EyeOff size={14} className="theme-text-muted" />}
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                <button onClick={() => openForm(p)} className="flex-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 theme-text-secondary rounded text-xs transition-colors">Edit</button>
                <button onClick={() => setImgModal(p)} className="flex-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 theme-text-secondary rounded text-xs transition-colors">Images</button>
                <button onClick={() => setDeleteId(p.id)} className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-xs text-red-500 dark:text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <p className="theme-text-muted text-center py-12 italic">No projects yet.</p>}

      {/* Project Form Modal */}
      <AdminModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm theme-label mb-1.5">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} /></div>
          <div><label className="block text-sm theme-label mb-1.5">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div className="md:col-span-2"><label className="block text-sm theme-label mb-1.5">Short Description</label><input type="text" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className={input} /></div>
          <div className="md:col-span-2"><label className="block text-sm theme-label mb-1.5">Full Description</label><textarea rows={3} value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} className={textarea} /></div>
          <div><label className="block text-sm theme-label mb-1.5">Objectives</label><textarea rows={2} value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} className={textarea} /></div>
          <div><label className="block text-sm theme-label mb-1.5">Features</label><textarea rows={2} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className={textarea} /></div>
          <div><label className="block text-sm theme-label mb-1.5">Technologies (comma-separated)</label><input type="text" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className={input} placeholder="React, Node.js, PostgreSQL" /></div>
          <div><label className="block text-sm theme-label mb-1.5">My Role</label><input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={input} /></div>
          <div><label className="block text-sm theme-label mb-1.5">GitHub URL</label><input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={input} /></div>
          <div><label className="block text-sm theme-label mb-1.5">Live Demo URL</label><input type="url" value={form.liveDemoUrl} onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })} className={input} /></div>
          <div>
            <label className="block text-sm theme-label mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={input}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-primary" /><span className="text-sm theme-label">Featured</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-primary" /><span className="text-sm theme-label">Published</span></label>
          </div>
          <div className="md:col-span-2">
            <ImageUpload currentImage={editing ? projects.find((p) => p.id === editing)?.thumbnailUrl : null} onChange={setThumbnail} label="Thumbnail" />
          </div>
        </div>
        <button onClick={saveProject} className="btn-primary w-full mt-6">{editing ? 'Update' : 'Create'} Project</button>
      </AdminModal>

      {/* Images Modal */}
      <AdminModal isOpen={!!imgModal} onClose={() => setImgModal(null)} title={`Screenshots — ${imgModal?.title}`} size="lg">
        {imgModal && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {(imgModal.images || []).map((img) => (
                <div key={img.id} className="relative group h-28 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => deleteImage(imgModal.id, img.id)} className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full items-center justify-center text-white hidden group-hover:flex"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 items-end">
              <input type="file" multiple accept="image/*" onChange={(e) => setScreenshots(e.target.files)} className="flex-1 text-sm theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-blue-700 dark:file:text-blue-400 file:cursor-pointer" />
              <button onClick={uploadScreenshots} disabled={!screenshots} className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50"><Upload size={14} /> Upload</button>
            </div>
          </>
        )}
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteProject} message="Delete this project and all its images?" />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Save, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AboutManager() {
  const [about, setAbout] = useState({ biography: '', interests: '', careerGoals: '' });
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eduModal, setEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '', description: '', isCurrent: false });
  const [editingEdu, setEditingEdu] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [aRes, eRes] = await Promise.all([api.about.get(), api.education.getAll()]);
      const a = aRes.data.about;
      if (a) setAbout({ biography: a.biography || '', interests: a.interests || '', careerGoals: a.careerGoals || '' });
      setEducation(eRes.data.education || aRes.data.education || []);
    } catch {}
  };

  const saveAbout = async () => {
    setLoading(true);
    try { await api.about.update(about); toast.success('About saved!'); } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  const saveEdu = async () => {
    try {
      if (editingEdu) { await api.education.update(editingEdu, eduForm); toast.success('Updated!'); }
      else { await api.education.create(eduForm); toast.success('Added!'); }
      setEduModal(false);
      setEditingEdu(null);
      loadData();
    } catch { toast.error('Failed'); }
  };

  const deleteEdu = async () => {
    try { await api.education.delete(deleteId); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  const openEduForm = (edu = null) => {
    if (edu) {
      setEditingEdu(edu.id);
      setEduForm({ institution: edu.institution, degree: edu.degree, field: edu.field || '', startYear: edu.startYear, endYear: edu.endYear || '', description: edu.description || '', isCurrent: edu.isCurrent });
    } else {
      setEditingEdu(null);
      setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '', description: '', isCurrent: false });
    }
    setEduModal(true);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 theme-text-primary">About Manager</h1>

      {/* About Form */}
      <div className="glass p-6 mb-6">
        <h2 className="font-semibold mb-4 theme-text-primary">About Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm theme-label mb-1.5">Biography</label>
            <textarea rows={5} value={about.biography} onChange={(e) => setAbout({ ...about, biography: e.target.value })} className="w-full px-4 py-2.5 theme-input resize-none" placeholder="Tell visitors about yourself..." />
          </div>
          <div>
            <label className="block text-sm theme-label mb-1.5">Interests</label>
            <textarea rows={2} value={about.interests} onChange={(e) => setAbout({ ...about, interests: e.target.value })} className="w-full px-4 py-2.5 theme-input resize-none" placeholder="Your technology and personal interests..." />
          </div>
          <div>
            <label className="block text-sm theme-label mb-1.5">Career Goals</label>
            <textarea rows={2} value={about.careerGoals} onChange={(e) => setAbout({ ...about, careerGoals: e.target.value })} className="w-full px-4 py-2.5 theme-input resize-none" placeholder="Your career aspirations..." />
          </div>
        </div>
        <button onClick={saveAbout} disabled={loading} className="btn-primary mt-4 flex items-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} Save About
        </button>
      </div>

      {/* Education */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold theme-text-primary">Education</h2>
          <button onClick={() => openEduForm()} className="btn-primary text-sm flex items-center gap-1"><Plus size={14} /> Add Education</button>
        </div>
        {education.length === 0 ? <p className="theme-text-muted text-sm italic">No education entries.</p> : (
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="p-4 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg flex items-start justify-between">
                <div>
                  <p className="font-medium theme-text-primary">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{edu.institution}</p>
                  <p className="text-xs theme-text-muted">{edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear}</p>
                  {edu.description && <p className="text-sm theme-text-secondary mt-1">{edu.description}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEduForm(edu)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Pencil size={14} className="theme-text-muted" /></button>
                  <button onClick={() => setDeleteId(edu.id)} className="p-1.5 hover:bg-red-500/10 rounded"><Trash2 size={14} className="text-red-500 dark:text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Modal */}
      <AdminModal isOpen={eduModal} onClose={() => setEduModal(false)} title={editingEdu ? 'Edit Education' : 'Add Education'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm theme-label mb-1.5">Institution</label>
            <input type="text" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm theme-label mb-1.5">Degree</label>
              <input type="text" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
            </div>
            <div>
              <label className="block text-sm theme-label mb-1.5">Field of Study</label>
              <input type="text" value={eduForm.field} onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm theme-label mb-1.5">Start Year</label>
              <input type="text" value={eduForm.startYear} onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })} className="w-full px-4 py-2.5 theme-input" placeholder="2022" />
            </div>
            <div>
              <label className="block text-sm theme-label mb-1.5">End Year</label>
              <input type="text" value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })} disabled={eduForm.isCurrent} className="w-full px-4 py-2.5 theme-input disabled:opacity-50" placeholder="2026" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={eduForm.isCurrent} onChange={(e) => setEduForm({ ...eduForm, isCurrent: e.target.checked })} className="accent-primary" />
            <span className="text-sm theme-label">Currently studying here</span>
          </label>
          <div>
            <label className="block text-sm theme-label mb-1.5">Description (optional)</label>
            <textarea rows={2} value={eduForm.description} onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })} className="w-full px-4 py-2.5 theme-input resize-none" />
          </div>
          <button onClick={saveEdu} className="btn-primary w-full">{editingEdu ? 'Update' : 'Add'} Education</button>
        </div>
      </AdminModal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteEdu} message="Delete this education entry?" />
    </div>
  );
}

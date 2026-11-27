import { useState, useEffect } from 'react';
import { Save, Upload, Trash2, Plus, Pencil, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ImageUpload from '../components/ImageUpload';

export default function ProfileManager() {
  const [profile, setProfile] = useState({ fullName: '', professionalTitle: '', introduction: '', tagline: '', email: '' });
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [socialForm, setSocialForm] = useState({ platform: '', url: '', icon: '' });
  const [editingSocial, setEditingSocial] = useState(null);
  const [showSocialForm, setShowSocialForm] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([api.profile.get(), api.socialLinks.getAll()]);
      const p = pRes.data.profile || {};
      setProfile({ fullName: p.fullName || '', professionalTitle: p.professionalTitle || '', introduction: p.introduction || '', tagline: p.tagline || '', email: p.email || '', profileImageUrl: p.profileImageUrl, resumeUrl: p.resumeUrl });
      setSocials(sRes.data.socialLinks || []);
    } catch { }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('fullName', profile.fullName);
      fd.append('professionalTitle', profile.professionalTitle);
      fd.append('introduction', profile.introduction);
      fd.append('tagline', profile.tagline);
      fd.append('email', profile.email);
      if (profileImage) fd.append('profileImage', profileImage);
      await api.profile.update(fd);
      toast.success('Profile saved!');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setLoading(false); }
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    const fd = new FormData();
    fd.append('resume', resumeFile);
    try { await api.profile.uploadResume(fd); toast.success('Resume uploaded!'); loadData(); } catch { toast.error('Upload failed'); }
  };

  const deleteResume = async () => {
    try { await api.profile.deleteResume(); toast.success('Resume deleted'); loadData(); } catch { toast.error('Delete failed'); }
  };

  const saveSocial = async () => {
    try {
      if (editingSocial) { await api.socialLinks.update(editingSocial, socialForm); toast.success('Updated!'); }
      else { await api.socialLinks.create(socialForm); toast.success('Added!'); }
      setSocialForm({ platform: '', url: '', icon: '' });
      setEditingSocial(null);
      setShowSocialForm(false);
      loadData();
    } catch { toast.error('Failed'); }
  };

  const deleteSocial = async (id) => {
    try { await api.socialLinks.delete(id); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 theme-text-primary">Profile Manager</h1>

      {/* Profile Form */}
      <div className="glass p-6 mb-6">
        <h2 className="font-semibold mb-4 theme-text-primary">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm theme-label mb-1.5">Full Name</label>
            <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
          </div>
          <div>
            <label className="block text-sm theme-label mb-1.5">Professional Title</label>
            <input type="text" value={profile.professionalTitle} onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm theme-label mb-1.5">Introduction</label>
          <textarea rows={3} value={profile.introduction} onChange={(e) => setProfile({ ...profile, introduction: e.target.value })} className="w-full px-4 py-2.5 theme-input resize-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm theme-label mb-1.5">Tagline</label>
            <input type="text" value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
          </div>
          <div>
            <label className="block text-sm theme-label mb-1.5">Email</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 theme-input" />
          </div>
        </div>
        <ImageUpload currentImage={profile.profileImageUrl} onChange={setProfileImage} label="Profile Image" />
        <button onClick={saveProfile} disabled={loading} className="btn-primary mt-4 flex items-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} Save Profile
        </button>
      </div>

      {/* Resume */}
      <div className="glass p-6 mb-6">
        <h2 className="font-semibold mb-4 theme-text-primary">Resume</h2>
        {profile.resumeUrl && <p className="text-sm theme-text-muted mb-2">Current: <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:underline">View Resume</a></p>}
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="w-full text-sm theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-blue-700 dark:file:text-blue-400 file:cursor-pointer" />
          </div>
          <button onClick={uploadResume} disabled={!resumeFile} className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50"><Upload size={14} /> Upload</button>
          {profile.resumeUrl && <button onClick={deleteResume} className="px-3 py-2.5 bg-red-500/10 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/20 text-sm"><Trash2 size={14} /></button>}
        </div>
      </div>

      {/* Social Links */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold theme-text-primary">Social Links</h2>
          <button onClick={() => { setShowSocialForm(true); setEditingSocial(null); setSocialForm({ platform: '', url: '', icon: '' }); }} className="btn-primary text-sm flex items-center gap-1"><Plus size={14} /> Add</button>
        </div>
        {socials.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 border-b border-slate-200 dark:border-white/5 last:border-0">
            <div>
              <p className="font-medium text-sm capitalize theme-text-primary">{s.platform}</p>
              <p className="text-xs theme-text-muted truncate max-w-xs">{s.url}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingSocial(s.id); setSocialForm({ platform: s.platform, url: s.url, icon: s.icon || '' }); setShowSocialForm(true); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Pencil size={14} className="theme-text-muted" /></button>
              <button onClick={() => deleteSocial(s.id)} className="p-1.5 hover:bg-red-500/10 rounded"><Trash2 size={14} className="text-red-500 dark:text-red-400" /></button>
            </div>
          </div>
        ))}
        {showSocialForm && (
          <div className="mt-4 p-4 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input type="text" placeholder="Platform (e.g. github)" value={socialForm.platform} onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })} className="px-3 py-2 theme-input text-sm" />
              <input type="url" placeholder="URL" value={socialForm.url} onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })} className="px-3 py-2 theme-input text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveSocial} className="btn-primary text-sm">{editingSocial ? 'Update' : 'Add'}</button>
              <button onClick={() => setShowSocialForm(false)} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 theme-text-secondary rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

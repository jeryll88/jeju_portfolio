import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';
import TechLogo from '../../components/TechLogo';

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Proficient', 'Advanced', 'Expert'];

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    proficiency: 'Proficient',
    description: '',
    logoUrl: '',
    order: 0,
    isPublished: true,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [catName, setCatName] = useState('');
  const [editingCat, setEditingCat] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([api.skills.getAll(), api.skills.getCategories()]);
      const cats = sRes.data.categories || [];
      const allSkills = [];
      cats.forEach((c) =>
        (c.skills || []).forEach((s) => allSkills.push({ ...s, category: c }))
      );
      setSkills(allSkills);
      setCategories(cRes.data.categories || cats);
    } catch {}
  };

  const openForm = (skill = null) => {
    if (skill) {
      setEditing(skill.id);
      setForm({
        name: skill.name,
        categoryId: skill.categoryId,
        proficiency: skill.proficiency || 'Proficient',
        description: skill.description || '',
        logoUrl: skill.logoUrl || '',
        order: skill.order || 0,
        isPublished: skill.isPublished,
      });
    } else {
      setEditing(null);
      setForm({
        name: '',
        categoryId: categories[0]?.id || '',
        proficiency: 'Proficient',
        description: '',
        logoUrl: '',
        order: skills.length + 1,
        isPublished: true,
      });
    }
    setLogoFile(null);
    setModal(true);
  };

  const saveSkill = async () => {
    if (!form.name.trim()) {
      toast.error('Skill name is required');
      return;
    }
    if (!form.categoryId) {
      toast.error('Please select a category');
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('categoryId', form.categoryId);
    fd.append('proficiency', form.proficiency);
    fd.append('description', form.description);
    fd.append('logoUrl', form.logoUrl);
    fd.append('order', form.order);
    fd.append('isPublished', form.isPublished);
    if (logoFile) fd.append('logo', logoFile);

    try {
      if (editing) {
        await api.skills.update(editing, fd);
        toast.success('Skill updated successfully!');
      } else {
        await api.skills.create(fd);
        toast.success('Skill added successfully!');
      }
      setModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to save skill');
    }
  };

  const deleteSkill = async () => {
    try {
      await api.skills.delete(deleteId);
      toast.success('Skill deleted');
      loadData();
    } catch {
      toast.error('Failed to delete skill');
    }
    setDeleteId(null);
  };

  const togglePublish = async (skill) => {
    const fd = new FormData();
    fd.append('name', skill.name);
    fd.append('categoryId', skill.categoryId);
    fd.append('proficiency', skill.proficiency);
    fd.append('description', skill.description || '');
    fd.append('isPublished', !skill.isPublished);
    try {
      await api.skills.update(skill.id, fd);
      loadData();
    } catch {}
  };

  const saveCat = async () => {
    try {
      if (editingCat) {
        await api.skills.updateCategory(editingCat, { name: catName });
        toast.success('Category updated!');
      } else {
        await api.skills.createCategory({ name: catName, order: categories.length + 1 });
        toast.success('Category added!');
      }
      setCatName('');
      setEditingCat(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const deleteCat = async (id) => {
    try {
      await api.skills.deleteCategory(id);
      toast.success('Category deleted');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete category with active skills');
    }
  };

  const filtered = skills.filter((s) => {
    const matchCat = catFilter === 'All' || s.category?.name === catFilter;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 theme-text-primary">
            <span>Technical Skills & Tools</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-primary/20 text-blue-700 dark:text-blue-300 border border-primary/30">
              {skills.length} Tools
            </span>
          </h1>
          <p className="theme-text-muted text-sm mt-1">
            Manage your IT competencies, categories, official logos, and proficiency levels.
          </p>
        </div>
        <button onClick={() => openForm()} className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <Plus size={16} /> Add New Skill
        </button>
      </div>

      {/* Categories Management Panel */}
      <div className="glass p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm theme-text-secondary">Categories ({categories.length})</h3>
          <span className="text-xs theme-text-muted">Edit or create custom skills categories</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs theme-text-secondary hover:border-primary/40 transition-colors"
            >
              <span className="font-medium theme-text-primary">{c.name}</span>
              <button
                onClick={() => {
                  setEditingCat(c.id);
                  setCatName(c.name);
                }}
                className="theme-text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Edit category name"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => deleteCat(c.id)}
                className="theme-text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Delete category"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Cloud & DevOps"
            className="flex-1 px-3 py-2 theme-input text-xs"
          />
          <button
            onClick={saveCat}
            disabled={!catName.trim()}
            className="btn-primary text-xs px-4 py-2 disabled:opacity-50"
          >
            {editingCat ? 'Update Category' : 'Add Category'}
          </button>
          {editingCat && (
            <button
              onClick={() => {
                setEditingCat(null);
                setCatName('');
              }}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-xs theme-text-secondary transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
          <input
            type="text"
            placeholder="Search skills by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 theme-input text-sm"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCatFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              catFilter === 'All'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 theme-text-secondary'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                catFilter === c.name
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 theme-text-secondary'
              }`}
            >
              {c.name.replace('Development', '').replace('& Platforms', '').trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table */}
      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
              <tr className="theme-text-muted text-xs font-medium">
                <th className="text-left p-4">Icon / Logo</th>
                <th className="text-left p-4">Technology</th>
                <th className="text-left p-4 hidden sm:table-cell">Category</th>
                <th className="text-left p-4 hidden md:table-cell">Short Description</th>
                <th className="text-left p-4">Proficiency</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 shadow-sm">
                      <TechLogo name={s.name} logoUrl={s.logoUrl} className="w-6 h-6" />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold theme-text-primary">{s.name}</span>
                  </td>
                  <td className="p-4 text-xs theme-text-secondary hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      {s.category?.name}
                    </span>
                  </td>
                  <td className="p-4 text-xs theme-text-muted hidden md:table-cell max-w-xs truncate">
                    {s.description || '—'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.proficiency === 'Advanced' || s.proficiency === 'Expert'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : s.proficiency === 'Proficient'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {s.proficiency}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish(s)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${
                        s.isPublished
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20'
                          : 'bg-gray-500/10 theme-text-muted border border-gray-500/20 hover:bg-gray-500/20'
                      }`}
                    >
                      {s.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{s.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openForm(s)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg theme-text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Edit skill"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg theme-text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="theme-text-muted text-center py-10 italic">No skills matching your filter.</p>
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      <AdminModal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Technical Skill' : 'Add Technical Skill / Tool'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold theme-label uppercase tracking-wider mb-1.5">
              Technology Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 theme-input text-sm"
              placeholder="e.g. TypeScript, Docker, Tailwind CSS"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold theme-label uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 theme-input text-sm"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold theme-label uppercase tracking-wider mb-1.5">
                Proficiency Level
              </label>
              <select
                value={form.proficiency}
                onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                className="w-full px-4 py-2.5 theme-input text-sm"
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold theme-label uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 theme-input text-sm"
              placeholder="e.g. Component architecture, custom Hooks, State management & reactive SPAs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold theme-label uppercase tracking-wider mb-1.5">
              Direct Logo URL (or use file upload below)
            </label>
            <input
              type="text"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full px-4 py-2 theme-input text-xs font-mono"
              placeholder="e.g. /tech-logos/react.svg or https://.../icon.svg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold theme-label uppercase tracking-wider mb-1.5">
              Upload Custom Logo
            </label>
            <ImageUpload
              currentImage={editing ? skills.find((s) => s.id === editing)?.logoUrl : null}
              onChange={setLogoFile}
              label="Select Icon/Logo file"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm theme-label">Publish on public portfolio</span>
            </label>
          </div>

          <button onClick={saveSkill} className="btn-primary w-full mt-2">
            {editing ? 'Update Technical Skill' : 'Save Technical Skill'}
          </button>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteSkill}
        message="Are you sure you want to delete this technical skill? This action cannot be undone."
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function SettingsManager() {
  const [settings, setSettings] = useState({ siteTitle: '', footerText: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.settings.get().then((r) => {
      if (r.data.settings) setSettings({ siteTitle: r.data.settings.siteTitle || '', footerText: r.data.settings.footerText || '' });
    }).catch(() => {});
  }, []);

  const save = async () => {
    setLoading(true);
    try { await api.settings.update(settings); toast.success('Settings saved!'); } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 theme-text-primary">Website Settings</h1>
      <div className="glass p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm theme-label mb-1.5">Site Title</label>
            <input type="text" value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className="w-full px-4 py-2.5 theme-input" placeholder="My Portfolio" />
          </div>
          <div>
            <label className="block text-sm theme-label mb-1.5">Footer Text</label>
            <textarea rows={3} value={settings.footerText} onChange={(e) => setSettings({ ...settings, footerText: e.target.value })} className="w-full px-4 py-2.5 theme-input resize-none" placeholder="Built with passion and code." />
          </div>
        </div>
        <button onClick={save} disabled={loading} className="btn-primary mt-4 flex items-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} Save Settings
        </button>
      </div>
    </div>
  );
}

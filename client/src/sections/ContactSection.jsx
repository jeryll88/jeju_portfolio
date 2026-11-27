import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, Github, Linkedin, Facebook, ExternalLink, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, facebook: Facebook, email: Mail };

export default function ContactSection() {
  const [profile, setProfile] = useState(null);
  const [socials, setSocials] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.profile.get().then((r) => setProfile(r.data.profile)).catch(() => {});
    api.socialLinks.getAll().then((r) => setSocials(r.data.socialLinks || [])).catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.contact.submit(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Feel free to reach out</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div className="lg:col-span-2 space-y-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-5 flex items-start gap-4 shadow-sm dark:shadow-none">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm theme-text-secondary mb-0.5">Email</h4>
                <a href={`mailto:${profile?.email || 'jeryllanne88@gmail.com'}`} className="text-blue-700 dark:text-blue-400 hover:underline text-sm transition-colors">
                  {profile?.email || 'jeryllanne88@gmail.com'}
                </a>
              </div>
            </div>

            <div className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-5 flex items-start gap-4 shadow-sm dark:shadow-none">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm theme-text-secondary mb-0.5">Contact</h4>
                <a href="tel:09569142158" className="text-blue-700 dark:text-blue-400 hover:underline text-sm transition-colors">
                  09569142158
                </a>
              </div>
            </div>

            <div className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-5 flex items-start gap-4 shadow-sm dark:shadow-none">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm theme-text-secondary mb-0.5">Location</h4>
                <p className="theme-text-muted text-sm">Poblacion, Lagangilang Abra</p>
              </div>
            </div>

            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || ExternalLink;
              return (
                <div key={s.id} className="glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-5 flex items-start gap-4 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm theme-text-secondary capitalize mb-0.5">{s.platform}</h4>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:underline text-sm break-all transition-colors">{s.url}</a>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="lg:col-span-3 glass bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-white/10 p-6 md:p-8 shadow-md dark:shadow-none"
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium theme-label mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-2.5 theme-input ${
                    errors.name ? '!border-red-500' : ''
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium theme-label mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-2.5 theme-input ${
                    errors.email ? '!border-red-500' : ''
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium theme-label mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={`w-full px-4 py-2.5 theme-input ${
                  errors.subject ? '!border-red-500' : ''
                }`}
                placeholder="Subject"
              />
              {errors.subject && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.subject}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium theme-label mb-1.5">Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`w-full px-4 py-2.5 theme-input resize-none ${
                  errors.message ? '!border-red-500' : ''
                }`}
                placeholder="Your message..."
              />
              {errors.message && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> Send Message</>}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

import { Github, Linkedin, Facebook, Mail, ExternalLink } from 'lucide-react';
import { SITE_SETTINGS, SOCIAL_LINKS } from '../data/portfolio';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
};

export default function Footer() {
  const settings = SITE_SETTINGS;
  const socials = SOCIAL_LINKS;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-200/60 dark:border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md shadow-primary/20 border-2 border-primary/40 flex items-center justify-center p-0.5 flex-shrink-0">
                <img src="/logo.png" alt="Jeryll Anne" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-lg theme-text-primary block leading-tight">JERYLL ANNE</span>
                <span className="text-[10px] theme-text-accent font-mono uppercase tracking-widest">IT Web Developer</span>
              </div>
            </div>
            <p className="theme-text-muted text-sm leading-relaxed">{settings?.footerText || 'Built with passion and code.'}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider theme-text-secondary mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {['home', 'about', 'skills', 'projects', 'awards', 'contact'].map((id) => (
                <button key={id} onClick={() => scrollTo(id)} className="theme-text-muted hover:text-primary dark:hover:text-white text-sm text-left capitalize transition-colors">
                  {id === 'awards' ? 'Awards & Certs' : id}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider theme-text-secondary mb-4">Connect</h3>
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = ICON_MAP[s.platform?.toLowerCase()] || ExternalLink;
                return (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary/20 flex items-center justify-center text-slate-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-all">
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-white/5 text-center theme-text-muted text-sm">
          © {new Date().getFullYear()} {settings?.siteTitle || 'Portfolio'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

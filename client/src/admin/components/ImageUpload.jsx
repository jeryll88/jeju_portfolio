import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ currentImage, onChange, accept = 'image/*', label = 'Upload Image' }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const displayImg = preview || currentImage;

  return (
    <div>
      <label className="block text-sm theme-label mb-1.5">{label}</label>
      {displayImg ? (
        <div className="relative group w-full h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
          <img src={displayImg} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30">Change</button>
            <button type="button" onClick={clear} className="px-3 py-1.5 bg-red-500/20 rounded-lg text-sm text-red-300 hover:bg-red-500/30">Remove</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
          }`}
        >
          <ImageIcon size={24} className="theme-text-muted mb-2" />
          <p className="text-sm theme-text-secondary">Click or drag to upload</p>
          <p className="text-xs theme-text-muted mt-1">JPG, PNG, WebP, SVG</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}

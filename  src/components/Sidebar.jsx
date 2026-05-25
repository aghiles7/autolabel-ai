import React from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';

export default function Sidebar({ images, currentIdx, setCurrentIdx, onUpload, labels, setLabels }) {
  return (
    <div className="w-64 bg-slate-800 border-r border-white/10 flex flex-col text-white">
      <div className="p-4 border-b border-white/10 font-bold text-xl">AutoLabel AI</div>
      <div className="p-4 space-y-6 overflow-y-auto">
        <label className="block w-full bg-blue-600 p-3 rounded-lg text-center cursor-pointer font-bold">
          <Plus className="inline mr-2" /> Images
          <input type="file" multiple onChange={onUpload} className="hidden" />
        </label>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-3">Labels</p>
          {labels.map(l => (
            <div key={l.id} className="flex items-center gap-2 mb-2 bg-slate-700 p-2 rounded">
              <input type="color" value={l.color} onChange={e => setLabels(labels.map(x => x.id === l.id ? {...x, color:e.target.value} : x))} className="w-4 h-4 bg-transparent cursor-pointer" />
              <input value={l.name} onChange={e => setLabels(labels.map(x => x.id === l.id ? {...x, name:e.target.value} : x))} className="bg-transparent text-sm w-full outline-none" />
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-3">Images</p>
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setCurrentIdx(i)} className={`w-full text-left p-2 rounded mb-1 truncate text-sm ${currentIdx === i ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              <ImageIcon size={14} className="inline mr-2" /> {img.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
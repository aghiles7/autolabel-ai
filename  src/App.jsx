import React, { useState, useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { Play, Download, Loader2, Upload } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CanvasEditor from './components/CanvasEditor';
import { exportData } from './utils/exportUtils';

export default function App() {
  const [images, setImages] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [labels, setLabels] = useState([
    { id: '1', name: 'Véhicule', color: '#3b82f6', aiMatch: ['car', 'truck', 'bus', 'motorcycle'] },
    { id: '2', name: 'Piéton', color: '#ef4444', aiMatch: ['person'] },
    { id: '3', name: 'Dashboard', color: '#10b981', aiMatch: [] }
  ]);
  const [annotations, setAnnotations] = useState({});
  const [loadingModel, setLoadingModel] = useState(true);
  const modelRef = useRef(null);

  useEffect(() => {
    cocoSsd.load().then(m => {
      modelRef.current = m;
      setLoadingModel(false);
    });
  }, []);

  const onUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImages(prev => [...prev, { id: Math.random().toString(36).substr(2,9), url, name: file.name, w: img.naturalWidth, h: img.naturalHeight }]);
        if (currentIdx === null) setCurrentIdx(0);
      };
    });
  };

  const autoAnnotate = async () => {
    if (!modelRef.current || currentIdx === null) return;
    const imgData = images[currentIdx];
    const tempImg = new Image();
    tempImg.src = imgData.url;
    await tempImg.decode();

    const preds = await modelRef.current.detect(tempImg);
    const newAnns = preds.map(p => {
      const matched = labels.find(l => l.aiMatch.includes(p.class)) || labels[0];
      return {
        id: Math.random(),
        labelId: matched.id,
        x: p.bbox[0] / imgData.w,
        y: p.bbox[1] / imgData.h,
        w: p.bbox[2] / imgData.w,
        h: p.bbox[3] / imgData.h,
        confidence: p.score
      };
    });
    setAnnotations(p => ({ ...p, [imgData.id]: newAnns }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar images={images} currentIdx={currentIdx} setCurrentIdx={setCurrentIdx} onUpload={onUpload} labels={labels} setLabels={setLabels} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-slate-800 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {loadingModel && <div className="flex items-center gap-2 text-xs text-orange-400"><Loader2 className="animate-spin" size={14}/> IA en chargement...</div>}
          </div>
          <div className="flex gap-3">
            <button disabled={loadingModel || currentIdx === null} onClick={autoAnnotate} className="flex bg-blue-600 px-4 py-2 rounded-lg font-bold disabled:opacity-30"><Play size={18} className="mr-2"/> IA Auto-Label</button>
            <button onClick={() => exportData(images, annotations, labels)} className="bg-slate-700 px-4 py-2 rounded-lg font-bold"><Download size={18}/></button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {currentIdx !== null ? <CanvasEditor image={images[currentIdx]} annotations={annotations[images[currentIdx].id] || []} labels={labels} /> : <div className="text-slate-500">Importer une image</div>}
        </main>
      </div>
    </div>
  );
}
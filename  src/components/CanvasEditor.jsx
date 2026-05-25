import React, { useRef, useEffect } from 'react';

export default function CanvasEditor({ image, annotations, labels }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image.url;
    img.onload = () => {
      canvas.width = image.w;
      canvas.height = image.h;
      ctx.drawImage(img, 0, 0);
      annotations.forEach(ann => {
        const label = labels.find(l => l.id === ann.labelId);
        const x = ann.x * canvas.width;
        const y = ann.y * canvas.height;
        const w = ann.w * canvas.width;
        const h = ann.h * canvas.height;
        ctx.strokeStyle = label.color;
        ctx.lineWidth = canvas.width / 300;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = label.color;
        ctx.font = `bold ${canvas.width/60}px Arial`;
        ctx.fillText(label.name, x, y - 10);
      });
    };
  }, [image, annotations, labels]);

  return <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl border border-white/10" />;
}
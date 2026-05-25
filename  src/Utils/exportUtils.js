export const exportData = (images, annotations, labels) => {
  if (images.length === 0) {
    alert("Aucune image à exporter");
    return;
  }

  const exportContent = images.map(img => ({
    image_name: img.name,
    width: img.w,
    height: img.h,
    annotations: (annotations[img.id] || []).map(ann => {
      const labelDef = labels.find(l => l.id === ann.labelId);
      return {
        label: labelDef ? labelDef.name : 'Unknown',
        bbox_normalized: {
          x: ann.x,
          y: ann.y,
          width: ann.w,
          height: ann.h
        },
        confidence: ann.confidence
      };
    })
  }));

  const blob = new Blob([JSON.stringify(exportContent, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dataset_annotations_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
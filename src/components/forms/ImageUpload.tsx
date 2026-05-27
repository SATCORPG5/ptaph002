import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';

interface ImageUploadProps {
  label?: string;
  onUpload: (url: string) => void; // Callback with the uploaded image URL
}

export default function ImageUpload({ label = 'Upload Image', onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    // Simple validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        alert('Upload failed');
        console.error(data);
      }
    } catch (e) {
      console.error(e);
      alert('Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      <div
        className={`flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer transition-colors ${isUploading ? 'opacity-50' : 'hover:border-cyan-400'} bg-black/30`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={triggerSelect}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-40 object-contain" />
        ) : (
          <p className="text-sm text-white/60">Drag & drop an image, or click to select</p>
        )}
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />
      </div>
      {isUploading && <p className="text-sm text-cyan-400">Uploading...</p>}
    </div>
  );
}

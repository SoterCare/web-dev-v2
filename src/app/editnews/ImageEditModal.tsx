"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, MediaSize } from 'react-easy-crop';
import { X, RotateCcw, RotateCw, Loader2, Check, Pencil } from 'lucide-react';
import { uploadNewsImageAction } from '../dashboard/news-actions';
import { getCroppedImg } from './cropImage';

type RatioKey = 'free' | '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

const RATIO_VALUES: Record<Exclude<RatioKey, 'free'>, number> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '3:4': 3 / 4,
  '9:16': 9 / 16,
};

const RATIO_KEYS: RatioKey[] = ['free', '16:9', '4:3', '1:1', '3:4', '9:16'];

interface Props {
  src: string;
  onClose: () => void;
  onSave: (newPath: string) => void;
}

export default function ImageEditModal({ src, onClose, onSave }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeRatio, setActiveRatio] = useState<RatioKey>('free');
  const [naturalAspect, setNaturalAspect] = useState(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const aspect: number =
    activeRatio === 'free' ? naturalAspect : RATIO_VALUES[activeRatio];

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
    setNaturalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    setError('');
    try {
      const blob = await getCroppedImg(src, croppedAreaPixels, rotation);
      const file = new File([blob], 'edited-image.webp', { type: 'image/webp' });
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadNewsImageAction(fd);
      onSave(result.path);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply edits');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Pencil size={13} className="text-[#3d7e93]" />
            <span className="text-sm font-bold text-[var(--text)]">Edit Image</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-panel)] text-[var(--text-muted)] transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Crop canvas */}
        <div className="relative flex-shrink-0" style={{ height: 340 }}>
          <div className="absolute inset-0 bg-[#0d0d0d]">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={onMediaLoaded}
              style={{
                containerStyle: { borderRadius: 0 },
                cropAreaStyle: {
                  border: '2px solid rgba(163,203,219,0.9)',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                },
              }}
            />
          </div>
        </div>

        {/* Zoom slider */}
        <div className="px-5 pt-3 pb-1 flex-shrink-0 flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] w-10 flex-shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#3d7e93] h-1 cursor-pointer"
            aria-label="Zoom"
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-3 space-y-3 flex-shrink-0">
          {/* Aspect ratio */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] w-10 flex-shrink-0">Ratio</span>
            <div className="flex gap-1.5 flex-wrap">
              {RATIO_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveRatio(key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeRatio === key
                      ? 'bg-[#3d7e93] text-white'
                      : 'bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text)] border border-black/5'
                  }`}
                >
                  {key === 'free' ? 'Free' : key}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] w-10 flex-shrink-0">Rotate</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setRotation((r) => r - 90)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <RotateCcw size={11} /> 90°
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => r + 90)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <RotateCw size={11} /> 90°
              </button>
              {rotation !== 0 && (
                <button
                  type="button"
                  onClick={() => setRotation(0)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-black/[0.06] flex items-center justify-between flex-shrink-0">
          <div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={saving || !croppedAreaPixels}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#3d7e93] text-white hover:bg-[#2d6478] disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {saving ? 'Applying…' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

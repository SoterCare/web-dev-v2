"use client";

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCcw, RotateCw, Loader2, Check, Pencil } from 'lucide-react';
import { uploadNewsImageAction } from '../dashboard/news-actions';
import { rotateImageSrc, getCroppedBlob } from './cropImage';

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
  const [displaySrc, setDisplaySrc] = useState(src);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [activeRatio, setActiveRatio] = useState<RatioKey>('free');
  const [rotating, setRotating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (activeRatio === 'free') {
      setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    } else {
      setCrop(centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, RATIO_VALUES[activeRatio], w, h),
        w, h,
      ));
    }
  }, [activeRatio]);

  const handleRatioChange = (key: RatioKey) => {
    setActiveRatio(key);
    if (!imgRef.current) return;
    const { naturalWidth: w, naturalHeight: h } = imgRef.current;
    if (key === 'free') {
      setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    } else {
      setCrop(centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, RATIO_VALUES[key], w, h),
        w, h,
      ));
    }
  };

  const handleRotate = async (deg: number) => {
    setRotating(true);
    setError('');
    try {
      const rotated = await rotateImageSrc(displaySrc, deg);
      setDisplaySrc(rotated);
      setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
      setCompletedCrop(undefined);
    } catch {
      setError('Rotation failed');
    } finally {
      setRotating(false);
    }
  };

  const handleReset = () => {
    setDisplaySrc(src);
    setActiveRatio('free');
    setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    setCompletedCrop(undefined);
  };

  const handleApply = async () => {
    if (!completedCrop || !imgRef.current) return;
    setSaving(true);
    setError('');
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop);
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

  const hasEdited = displaySrc !== src;

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
        <div className="flex-1 min-h-0 bg-[#0d0d0d] flex items-center justify-center p-6 overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(px) => setCrop(px)}
            onComplete={(px) => setCompletedCrop(px)}
            aspect={activeRatio === 'free' ? undefined : RATIO_VALUES[activeRatio]}
            keepSelection
          >
            <img
              ref={imgRef}
              src={displaySrc}
              onLoad={onImageLoad}
              alt="Edit"
              crossOrigin="anonymous"
              style={{ maxHeight: '52vh', maxWidth: '100%', display: 'block' }}
            />
          </ReactCrop>
        </div>

        {/* Controls */}
        <div className="px-5 py-3 space-y-3 border-t border-black/[0.06] flex-shrink-0">
          {/* Ratio */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] w-10 flex-shrink-0">
              Ratio
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {RATIO_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleRatioChange(key)}
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
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] w-10 flex-shrink-0">
              Rotate
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleRotate(-90)}
                disabled={rotating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50 transition-colors"
              >
                {rotating ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />} 90°
              </button>
              <button
                type="button"
                onClick={() => handleRotate(90)}
                disabled={rotating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50 transition-colors"
              >
                {rotating ? <Loader2 size={11} className="animate-spin" /> : <RotateCw size={11} />} 90°
              </button>
              {hasEdited && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={rotating || saving}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-red-500 disabled:opacity-50 transition-colors"
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
              disabled={saving || !completedCrop}
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

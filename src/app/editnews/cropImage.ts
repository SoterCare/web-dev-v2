import type { PixelCrop } from 'react-image-crop';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draws src rotated by degrees onto a canvas and returns a WebP data URL. */
export async function rotateImageSrc(src: string, degrees: number): Promise<string> {
  const image = await loadImage(src);
  const rotRad = (degrees * Math.PI) / 180;
  const bw =
    Math.abs(Math.cos(rotRad) * image.naturalWidth) +
    Math.abs(Math.sin(rotRad) * image.naturalHeight);
  const bh =
    Math.abs(Math.sin(rotRad) * image.naturalWidth) +
    Math.abs(Math.cos(rotRad) * image.naturalHeight);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bw);
  canvas.height = Math.round(bh);
  const ctx = canvas.getContext('2d')!;
  ctx.translate(bw / 2, bh / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  return canvas.toDataURL('image/webp', 0.9);
}

/**
 * Crops imgEl at pixelCrop (in displayed-pixel coordinates) and returns a
 * WebP blob at the image's natural resolution.
 */
export async function getCroppedBlob(
  imgEl: HTMLImageElement,
  pixelCrop: PixelCrop,
): Promise<Blob> {
  const scaleX = imgEl.naturalWidth / imgEl.width;
  const scaleY = imgEl.naturalHeight / imgEl.height;

  const outputW = Math.round(pixelCrop.width * scaleX);
  const outputH = Math.round(pixelCrop.height * scaleY);

  const canvas = document.createElement('canvas');
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    imgEl,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0, 0,
    outputW, outputH,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty'))),
      'image/webp',
      0.9,
    );
  });
}

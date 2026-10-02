"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export default function PitchViewer({ src }: { src: string | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const loadingRef = useRef<PDFDocumentLoadingTask | null>(null);
  const taskRef = useRef<RenderTask | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(src ? null : "No PDF found in public/pitch-deck.");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [uiVisible, setUiVisible] = useState(true);
  const [isFull, setIsFull] = useState(false);

  // Load the PDF
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        const loading = pdfjs.getDocument({ url: src });
        loadingRef.current = loading;
        const doc = await loading.promise;
        if (cancelled) return;
        docRef.current = doc;
        setTotal(doc.numPages);
      } catch {
        if (!cancelled) setError("Could not load the pitch deck.");
      }
    })();
    return () => {
      cancelled = true;
      loadingRef.current?.destroy();
      loadingRef.current = null;
      docRef.current = null;
    };
  }, [src]);

  // Track viewport size
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Render the current slide, fitted to the viewport
  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || !total || !size.w) return;
    let cancelled = false;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const fit = Math.min(size.w / base.width, size.h / base.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: fit * dpr });
      // Draw offscreen then swap, so slides change without a blank flash
      const off = document.createElement("canvas");
      off.width = Math.floor(viewport.width);
      off.height = Math.floor(viewport.height);
      taskRef.current?.cancel();
      const task = pdfPage.render({ canvas: off, viewport });
      taskRef.current = task;
      try {
        await task.promise;
      } catch {
        return; // cancelled by a newer render
      }
      if (cancelled) return;
      canvas.width = off.width;
      canvas.height = off.height;
      canvas.style.width = `${off.width / dpr}px`;
      canvas.style.height = `${off.height / dpr}px`;
      canvas.getContext("2d")?.drawImage(off, 0, 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, total, size]);

  const go = useCallback(
    (delta: number) => setPage((p) => Math.min(Math.max(p + delta, 1), total || 1)),
    [total],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          setPage(1);
          break;
        case "End":
          setPage(total || 1);
          break;
        case ".":
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total, toggleFullscreen]);

  // Lock page scroll while the viewer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Controls fade out when the mouse is idle
  const wake = () => {
    setUiVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUiVisible(false), 2000);
  };
  useEffect(() => {
    hideTimer.current = setTimeout(() => setUiVisible(false), 3000);
    return () => clearTimeout(hideTimer.current);
  }, []);

  return (
    <div
      ref={rootRef}
      onMouseMove={wake}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        go(e.clientX / window.innerWidth < 0.25 ? -1 : 1);
      }}
      className="fixed inset-0 z-[2147483000] bg-black flex items-center justify-center select-none"
      style={{ cursor: uiVisible ? "default" : "none" }}
    >
      {error ? (
        <p className="text-white/70 text-lg">{error}</p>
      ) : (
        <canvas ref={canvasRef} className="block" aria-label={`Slide ${page} of ${total}`} />
      )}

      {!error && total > 0 && (
        <div
          className={`absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 transition-opacity duration-300 ${uiVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <span className="text-white/80 text-sm tabular-nums bg-white/10 backdrop-blur px-3 py-1 rounded-full">
            {page} / {total}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-1 rounded-full"
          >
            {isFull ? "Exit fullscreen" : "Fullscreen ( . )"}
          </button>
        </div>
      )}
    </div>
  );
}

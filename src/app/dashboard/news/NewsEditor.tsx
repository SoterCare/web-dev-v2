"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronUp, ChevronDown, Plus, Trash2, X,
  Save, Upload, Loader2,
} from 'lucide-react';
import type { NewsArticle, NewsData } from '@/types/news';
import { saveNewsAction, uploadNewsImageAction } from '../news-actions';

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function emptyArticle(): NewsArticle {
  return {
    id: crypto.randomUUID(),
    title: '',
    slug: '',
    summary: '',
    body: '',
    date: new Date().toISOString().split('T')[0],
    coverImage: '',
    tags: [],
  };
}

function TagInput({
  tags,
  onAdd,
  onRemove,
}: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
}) {
  const [input, setInput] = useState('');

  const commit = () => {
    const val = input.trim();
    if (val) { onAdd(val); setInput(''); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs font-medium bg-[#a0cbdb]/20 text-[#3d7e93] px-2.5 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:text-red-500 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        onBlur={commit}
        placeholder="Type a tag and press Enter"
        className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
      />
    </div>
  );
}

function CoverUpload({
  value,
  onUpload,
}: {
  value: string;
  onUpload: (p: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadNewsImageAction(fd);
      onUpload(result.path);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      {value ? (
        <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-[var(--bg-panel)] flex-shrink-0 border border-black/5">
          <Image src={value} alt="Cover preview" fill className="object-cover" sizes="128px" />
        </div>
      ) : (
        <div className="w-32 h-20 rounded-xl bg-[var(--bg-panel)] border border-dashed border-black/10 flex items-center justify-center flex-shrink-0">
          <Upload size={16} className="text-[var(--text-muted)]" />
        </div>
      )}
      <div className="flex flex-col gap-2 flex-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors disabled:opacity-50 w-fit"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        {value && (
          <p className="text-xs text-[var(--text-muted)] font-mono truncate max-w-[220px]">{value}</p>
        )}
        {uploadError && (
          <p className="text-xs text-red-500">{uploadError}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

export default function NewsEditor({ initialData }: { initialData: NewsData }) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialData.articles);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const update = (id: string, patch: Partial<NewsArticle>) =>
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const handleTitleChange = (id: string, title: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const autoSlug = a.slug === '' || a.slug === slugify(a.title);
        return { ...a, title, slug: autoSlug ? slugify(title) : a.slug };
      }),
    );
  };

  const addArticle = () => setArticles((prev) => [emptyArticle(), ...prev]);

  const removeArticle = (id: string) => {
    if (!confirm('Remove this article? This cannot be undone until you save.')) return;
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const move = (id: string, dir: -1 | 1) => {
    setArticles((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx + dir < 0 || idx + dir >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
      return next;
    });
  };

  const addTag = (id: string, tag: string) =>
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id && !a.tags.includes(tag) ? { ...a, tags: [...a.tags, tag] } : a,
      ),
    );

  const removeTag = (id: string, tag: string) =>
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, tags: a.tags.filter((t) => t !== tag) } : a)),
    );

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      await saveNewsAction({ articles });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-28">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">News Articles</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={addArticle}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#3d7e93] text-white hover:bg-[#2d6478] transition-colors"
        >
          <Plus size={14} />
          Add article
        </button>
      </div>

      {/* Article list */}
      <div className="space-y-6">
        {articles.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p className="text-base font-medium">No articles yet.</p>
            <button
              type="button"
              onClick={addArticle}
              className="mt-4 text-[#3d7e93] text-sm font-semibold hover:underline"
            >
              Add your first article →
            </button>
          </div>
        )}

        {articles.map((article, idx) => (
          <div key={article.id} className="bg-[var(--bg-card)] rounded-3xl shadow-[var(--shadow-m)] p-6">
            {/* Article control row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => move(article.id, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-panel)] disabled:opacity-30 transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp size={14} className="text-[var(--text-muted)]" />
                </button>
                <button
                  type="button"
                  onClick={() => move(article.id, 1)}
                  disabled={idx === articles.length - 1}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-panel)] disabled:opacity-30 transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown size={14} className="text-[var(--text-muted)]" />
                </button>
                <span className="text-xs text-[var(--text-muted)] font-medium ml-1">
                  #{idx + 1}
                </span>
                {article.title && (
                  <span className="text-xs text-[var(--text)] font-semibold ml-2 truncate max-w-[240px]">
                    {article.title}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeArticle(article.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                aria-label="Remove article"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => handleTitleChange(article.id, e.target.value)}
                  placeholder="Article title"
                  className="w-full px-4 py-2.5 text-base font-medium rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => update(article.id, { slug: e.target.value })}
                  placeholder="url-friendly-slug"
                  className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={article.date}
                  onChange={(e) => update(article.id, { date: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                />
              </div>

              {/* Summary */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Summary
                </label>
                <textarea
                  value={article.summary}
                  onChange={(e) => update(article.id, { summary: e.target.value })}
                  rows={2}
                  placeholder="One or two sentence teaser shown on the card."
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                />
              </div>

              {/* Body */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Body
                </label>
                <textarea
                  value={article.body}
                  onChange={(e) => update(article.id, { body: e.target.value })}
                  rows={12}
                  placeholder="Full article content. Separate paragraphs with a blank line."
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-y focus:outline-none focus:ring-1 focus:ring-[#a0cbdb] font-[system-ui]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Tags
                </label>
                <TagInput
                  tags={article.tags}
                  onAdd={(t) => addTag(article.id, t)}
                  onRemove={(t) => removeTag(article.id, t)}
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Cover Image
                </label>
                <CoverUpload
                  value={article.coverImage}
                  onUpload={(p) => update(article.id, { coverImage: p })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-5 md:px-8 py-4 bg-[var(--bg-body)]/90 backdrop-blur border-t border-black/[0.06] flex items-center justify-between gap-4">
        <div className="text-sm min-h-[20px]">
          {saveError && <span className="text-red-500">{saveError}</span>}
          {saved && !saveError && (
            <span className="text-[#3d7e93] font-medium">Saved successfully.</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#3d7e93] text-white hover:bg-[#2d6478] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown, ChevronUp, Plus, Trash2, X,
  Save, Upload, Loader2, Newspaper, Pin,
} from 'lucide-react';
import type { NewsArticle, NewsData } from '@/types/news';
import { sortArticles } from '@/lib/news-sort';
import { saveNewsAction, uploadNewsImageAction } from '../dashboard/news-actions';

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
    pinned: false,
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
        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
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
  const [articles, setArticles] = useState<NewsArticle[]>(() =>
    sortArticles(initialData.articles)
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pinWarning, setPinWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const pinnedCount = articles.filter((a) => a.pinned).length;

  const update = (id: string, patch: Partial<NewsArticle>) =>
    setArticles((prev) =>
      sortArticles(prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    );

  const handleTitleChange = (id: string, title: string) => {
    setArticles((prev) =>
      sortArticles(
        prev.map((a) => {
          if (a.id !== id) return a;
          const autoSlug = a.slug === '' || a.slug === slugify(a.title);
          return { ...a, title, slug: autoSlug ? slugify(title) : a.slug };
        })
      )
    );
  };

  const togglePin = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;
    if (!article.pinned && pinnedCount >= 3) {
      setPinWarning(true);
      setTimeout(() => setPinWarning(false), 3000);
      return;
    }
    update(id, { pinned: !article.pinned });
  };

  const addArticle = () => {
    const fresh = emptyArticle();
    setArticles((prev) => sortArticles([fresh, ...prev]));
    setExpandedId(fresh.id);
  };

  const removeArticle = (id: string) => {
    if (!confirm('Remove this article?')) return;
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setExpandedId((prev) => (prev === id ? null : prev));
  };

  const addTag = (id: string, tag: string) =>
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id && !a.tags.includes(tag) ? { ...a, tags: [...a.tags, tag] } : a
      )
    );

  const removeTag = (id: string, tag: string) =>
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, tags: a.tags.filter((t) => t !== tag) } : a))
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
    <div className="min-h-screen bg-[#fafafa] relative">
      {/* Dotted background */}
      <div
        className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[var(--bg-body)]/90 backdrop-blur border-b border-black/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Newspaper size={16} className="text-[#3d7e93] flex-shrink-0" />
              <span className="text-sm font-bold text-[var(--text)] tracking-tight truncate">
                <span className="hidden sm:inline">SoterCare — </span>News Editor
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-panel)] px-2 py-0.5 rounded-full border border-black/5 ml-0.5 flex-shrink-0">
                dev only
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/news"
                target="_blank"
                className="hidden sm:block text-xs font-semibold text-[var(--text-muted)] hover:text-[#3d7e93] transition-colors"
              >
                View /news →
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#3d7e93] text-white hover:bg-[#2d6478] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
          {/* Status strip */}
          {(saved || saveError || pinWarning) && (
            <div
              className={`text-center text-xs py-1 font-medium ${
                saveError
                  ? 'bg-red-50 text-red-600'
                  : pinWarning
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-[#a0cbdb]/10 text-[#3d7e93]'
              }`}
            >
              {saveError || (pinWarning ? 'Max 3 articles can be pinned.' : 'Saved successfully.')}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">Articles</h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {articles.length} article{articles.length !== 1 ? 's' : ''} · changes saved to{' '}
                <code className="font-mono text-[10px] bg-[var(--bg-panel)] px-1.5 py-0.5 rounded">
                  data/news.json
                </code>
                {pinnedCount > 0 && (
                  <span className="ml-2 text-[#3d7e93] font-semibold">
                    · {pinnedCount}/3 pinned
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={addArticle}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-m)] text-[var(--text-muted)] hover:text-[#3d7e93] transition-colors border border-black/[0.04]"
            >
              <Plus size={13} />
              Add article
            </button>
          </div>

          {/* Article list */}
          <div className="space-y-3">
            {articles.length === 0 && (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="font-medium">No articles yet.</p>
                <button
                  type="button"
                  onClick={addArticle}
                  className="mt-3 text-[#3d7e93] text-sm font-semibold hover:underline"
                >
                  Add your first article →
                </button>
              </div>
            )}

            {articles.map((article) => {
              const isOpen = expandedId === article.id;
              return (
                <div
                  key={article.id}
                  className={`bg-[var(--bg-card)] rounded-3xl shadow-[var(--shadow-m)] overflow-hidden border ${
                    article.pinned ? 'border-[#3d7e93]/20' : 'border-black/[0.03]'
                  }`}
                >
                  {/* Collapsed header row — always visible */}
                  <div
                    className="flex items-center gap-2 px-4 sm:px-5 py-3.5 cursor-pointer select-none"
                    onClick={() => setExpandedId(isOpen ? null : article.id)}
                  >
                    {/* Pin button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); togglePin(article.id); }}
                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                        article.pinned
                          ? 'text-[#3d7e93] bg-[#3d7e93]/10'
                          : 'text-[var(--text-muted)] hover:text-[#3d7e93] hover:bg-[var(--bg-panel)]'
                      }`}
                      aria-label={article.pinned ? 'Unpin article' : 'Pin article'}
                    >
                      <Pin size={13} className={article.pinned ? 'fill-[#3d7e93]' : ''} />
                    </button>

                    {/* Title + date */}
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text)] truncate">
                        {article.title || <span className="text-[var(--text-muted)] font-normal italic">Untitled</span>}
                      </span>
                      {article.date && (
                        <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-panel)] px-2 py-0.5 rounded-full flex-shrink-0">
                          {article.date}
                        </span>
                      )}
                      {article.pinned && (
                        <span className="text-[10px] font-semibold text-[#3d7e93] bg-[#3d7e93]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          Pinned
                        </span>
                      )}
                    </div>

                    {/* Delete + chevron */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeArticle(article.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        aria-label="Remove article"
                      >
                        <Trash2 size={13} />
                      </button>
                      <span className="p-1.5 text-[var(--text-muted)]">
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded form */}
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-black/[0.04]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Title</label>
                          <input
                            type="text"
                            value={article.title}
                            onChange={(e) => handleTitleChange(article.id, e.target.value)}
                            placeholder="Article title"
                            className="w-full px-4 py-2.5 text-base font-medium rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Slug</label>
                          <input
                            type="text"
                            value={article.slug}
                            onChange={(e) => update(article.id, { slug: e.target.value })}
                            placeholder="url-friendly-slug"
                            className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Date</label>
                          <input
                            type="date"
                            value={article.date}
                            onChange={(e) => update(article.id, { date: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Summary</label>
                          <textarea
                            value={article.summary}
                            onChange={(e) => update(article.id, { summary: e.target.value })}
                            rows={2}
                            placeholder="One or two sentence teaser shown on the card."
                            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Body</label>
                          <textarea
                            value={article.body}
                            onChange={(e) => update(article.id, { body: e.target.value })}
                            rows={12}
                            placeholder="Full article content. Separate paragraphs with a blank line."
                            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-y focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tags</label>
                          <TagInput
                            tags={article.tags}
                            onAdd={(t) => addTag(article.id, t)}
                            onRemove={(t) => removeTag(article.id, t)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Cover Image</label>
                          <CoverUpload
                            value={article.coverImage}
                            onUpload={(p) => update(article.id, { coverImage: p })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

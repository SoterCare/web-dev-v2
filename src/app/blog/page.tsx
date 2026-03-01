import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | SoterCare',
  description: 'Stay updated with the latest news, articles, and insights about elderly care technology from SoterCare.',
};

interface Post {
  _id: string;
  title: string;
  slug: string;
  author: {
    name: string;
    image?: {
      asset: {
        _ref: string;
      };
    };
  } | null;
  publishedAt: string;
  excerpt: string | null;
  mainImage: {
    asset: {
      _ref: string;
    };
    alt?: string;
  } | null;
}

const POSTS_QUERY = `*[_type=="post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  author->{
    name,
    image
  },
  publishedAt,
  excerpt,
  mainImage
}`;

async function getPosts(): Promise<Post[]> {
  return client.fetch(POSTS_QUERY);
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#fafafa] text-foreground selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Background pattern */}
      <div className="fixed top-0 left-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

      <div className="relative z-10 px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-32">
        {/* Back Link */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors text-text-muted hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16 text-center">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-6 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
            Blog
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Latest Blogs & News
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-muted">
            Keep up to date with everything about our system
          </p>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-text-muted">No blog posts yet. Check back soon!</p>
          </div>
        )}

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="overflow-hidden transition-all duration-300 border shadow-md group bg-bg-card rounded-2xl border-black/5 hover:shadow-xl hover:-translate-y-1 hover:ring-1 hover:ring-black/5"
            >
              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                {post.mainImage?.asset ? (
                  <Image
                    src={urlFor(post.mainImage).width(600).height(400).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="mb-3 text-xl font-bold transition-colors text-foreground group-hover:text-foreground/80 line-clamp-2">
                  {post.title}
                </h2>
                
                {post.excerpt && (
                  <p className="mb-4 text-sm leading-relaxed text-text-muted line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Row */}
                <div className="flex items-center justify-between pt-4 text-sm border-t border-black/5 text-text-muted">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-foreground/50" />
                    <span>{post.author?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-foreground/50" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

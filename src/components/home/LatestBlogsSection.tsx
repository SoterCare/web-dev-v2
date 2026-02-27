'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

gsap.registerPlugin(ScrollTrigger);

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

const POSTS_QUERY = `*[_type=="post"] | order(publishedAt desc)[0...3]{
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

const LatestBlogsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await client.fetch<Post[]>(POSTS_QUERY);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useGSAP(() => {
    if (loading) return;
    
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: sectionRef, dependencies: [loading] });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Placeholder card component for empty state
  const PlaceholderCard = ({ index }: { index: number }) => (
    <div
      key={`placeholder-${index}`}
      className="overflow-hidden transition-all duration-300 border shadow-md bg-bg-card rounded-2xl border-black/5"
    >
      {/* Placeholder Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-200">
        <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
          <span className="text-sm">No image</span>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="p-6">
        <h3 className="mb-3 text-xl font-bold text-foreground line-clamp-2">
          Coming Soon
        </h3>
        
        <p className="mb-4 text-sm leading-relaxed text-text-muted line-clamp-3">
          Stay tuned for more updates and articles about our elderly care technology.
        </p>

        {/* Meta Row */}
        <div className="flex items-center justify-between pt-4 text-sm border-t border-black/5 text-text-muted">
          <div className="flex items-center gap-2">
            <User size={16} className="text-foreground/50" />
            <span>SoterCare Team</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-foreground/50" />
            <span>Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="blog" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 pt-24 pb-24 overflow-hidden bg-transparent md:pt-32">
      <div ref={contentRef} className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-6 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
            Blog
          </span>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Latest Blogs & News
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-muted">
            Keep up to date with everything about our system
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden transition-all duration-300 border shadow-md bg-bg-card rounded-2xl border-black/5 animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-6">
                  <div className="w-3/4 h-6 mb-3 bg-gray-200 rounded" />
                  <div className="w-full h-4 mb-2 bg-gray-200 rounded" />
                  <div className="w-2/3 h-4 mb-4 bg-gray-200 rounded" />
                  <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
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
                    <h3 className="mb-3 text-xl font-bold transition-colors text-foreground group-hover:text-foreground/80 line-clamp-2">
                      {post.title}
                    </h3>
                    
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
              ))
            ) : (
              // Show 3 placeholder cards when no posts exist
              [0, 1, 2].map((i) => <PlaceholderCard key={i} index={i} />)
            )}
          </div>
        )}

        {/* View All Link */}
        {!loading && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 font-semibold transition-all duration-300 border rounded-full text-foreground bg-bg-card border-black/5 shadow-m hover:shadow-lg hover:-translate-y-0.5"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogsSection;

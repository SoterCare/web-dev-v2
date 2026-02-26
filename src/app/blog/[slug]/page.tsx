import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, ArrowLeft } from 'lucide-react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PostDetail {
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
  body: Array<{
    _type: string;
    _key: string;
    [key: string]: unknown;
  }>;
}

const POST_QUERY = `*[_type=="post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  author->{
    name,
    image
  },
  publishedAt,
  excerpt,
  mainImage,
  body
}`;

const ALL_SLUGS_QUERY = `*[_type=="post" && defined(slug.current)]{ "slug": slug.current }`;

async function getPost(slug: string): Promise<PostDetail | null> {
  return client.fetch(POST_QUERY, { slug });
}

async function getAllSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(ALL_SLUGS_QUERY);
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | SoterCare',
    };
  }

  return {
    title: `${post.title} | SoterCare Blog`,
    description: post.excerpt || `Read ${post.title} on SoterCare Blog`,
  };
}

// Custom components for PortableText
const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold md:text-4xl text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-2xl font-bold md:text-3xl text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xl font-bold md:text-2xl text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-3 text-lg font-bold md:text-xl text-foreground">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-text-muted">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pl-4 my-6 italic border-l-4 border-foreground/20 text-text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 space-y-2 list-disc text-text-muted">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 space-y-2 list-decimal text-text-muted">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline transition-colors text-blue-600 hover:text-blue-800"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || 'Blog image'}
            width={1200}
            height={675}
            className="w-full rounded-2xl"
          />
          {value.alt && (
            <figcaption className="mt-2 text-sm text-center text-text-muted">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-foreground selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Background pattern */}
      <div className="fixed top-0 left-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

      <article className="relative z-10">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden bg-gray-200">
          {post.mainImage?.asset ? (
            <Image
              src={urlFor(post.mainImage).width(1920).height(1080).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
              <span className="text-lg">No image</span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative px-4 mx-auto -mt-32 max-w-4xl sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Title Card */}
          <div className="p-8 border shadow-xl bg-bg-card rounded-2xl border-black/5 md:p-12">
            <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
              {post.title}
            </h1>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 text-sm border-b border-black/5 text-text-muted">
              <div className="flex items-center gap-2">
                {post.author?.image?.asset ? (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User size={20} className="text-foreground/50" />
                )}
                <span className="font-medium">{post.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-foreground/50" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>

            {/* Body Content */}
            <div className="prose prose-lg max-w-none">
              {post.body && <PortableText value={post.body} components={portableTextComponents} />}
            </div>

            {/* Back Button */}
            <div className="pt-8 mt-12 border-t border-black/5">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border rounded-full text-foreground bg-bg-card border-black/10 shadow-m hover:shadow-lg hover:-translate-y-0.5"
              >
                <ArrowLeft size={18} />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-24" />
      </article>
    </main>
  );
}

import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.frontmatter.title} | SoterCare Blog`,
        description: post.frontmatter.excerpt,
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Post not found</h1>
                <Link href="/blog" className="text-blue-600 hover:underline">
                    &larr; Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center text-text-muted hover:text-text mb-8 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
            </Link>

            <header className="mb-10 text-center">
                <div className="mb-4">
                    <time className="text-sm text-text-muted bg-bg-panel px-3 py-1 rounded-full border border-white/50">
                        {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                    {post.frontmatter.title}
                </h1>
                {post.frontmatter.author && (
                    <div className="flex items-center justify-center gap-2 text-text-muted">
                        <span>By {post.frontmatter.author}</span>
                    </div>
                )}
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none 
           prose-headings:font-bold prose-headings:font-sans
           prose-p:text-text-muted prose-p:leading-relaxed
           prose-strong:text-text
           prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
           bg-bg-card p-8 md:p-12 rounded-[2rem] shadow-m border border-white/10
      ">
                <MDXRemote source={post.content} />
            </div>

            <div className="mt-12 text-center">
                <Link href="/blog" className="bg-bg-card shadow-m text-foreground px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 inline-block">
                    Read More Posts
                </Link>
            </div>
        </article>
    );
}

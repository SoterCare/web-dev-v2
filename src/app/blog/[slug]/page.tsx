import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/hygraph';
import Navbar from '@/components/Navbar';
import BlogFooter from '@/components/BlogFooter';
import { ArrowLeft } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen text-text relative selection:bg-blue-100 selection:text-blue-900">
            <div className="fixed top-0 left-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
            <Navbar />

            <article className="pt-32 pb-24 w-full relative z-10">
                {/* Header Section */}
                <div className="w-full max-w-4xl mx-auto px-8 flex flex-col gap-6 mb-12">
                    <Link href="/blog" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors w-fit mb-4">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-text-muted">
                        <div className="flex items-center gap-2">
                            {post.author?.picture && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={post.author.picture.url}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <span className="font-medium text-text">{post.author?.name || 'SoterCare Team'}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-16">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-sm">
                            <Image
                                src={post.coverImage.url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="w-full max-w-3xl mx-auto px-8 prose prose-lg prose-blue prose-headings:font-bold prose-headings:text-text prose-p:text-text-muted prose-a:text-blue-600">
                    {post.content.html ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content.html }} />
                    ) : (
                        <p>{post.content.text}</p>
                    )}
                </div>
            </article>

            <BlogFooter />
        </main>
    );
}

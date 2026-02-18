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
                <div className="w-full max-w-3xl mx-auto px-8 flex flex-col gap-6 mb-12 text-center md:text-left">
                    <Link href="/blog" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors w-fit mb-4 group">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium">Back to Blog</span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-text">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-text-muted justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            {post.author?.picture ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <Image
                                        src={post.author.picture.url}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-white shadow-sm">
                                    SC
                                </div>
                            )}
                            <div className="flex flex-col text-sm">
                                <span className="font-semibold text-text">{post.author?.name || 'SoterCare Team'}</span>
                                <span className="text-xs">Author</span>
                            </div>
                        </div>
                        <span className="text-black/20 text-xl font-light">|</span>
                        <div className="flex flex-col text-sm">
                            <span className="font-semibold text-text">{new Date(post.publishedAt).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                            <span className="text-xs">Published</span>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-16">
                        <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
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
                <div className="w-full max-w-3xl mx-auto px-8 md:px-12 py-12 mb-20 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-sm relative z-10">
                    <div className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-bold prose-headings:text-text prose-headings:font-urw
                        prose-p:text-text/80 prose-p:text-[1.125rem] prose-p:leading-[1.8] prose-p:font-normal
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                        prose-strong:text-text prose-strong:font-semibold
                        prose-ul:text-text/80 prose-ul:list-disc prose-ul:pl-6
                        prose-li:marker:text-blue-500
                        prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-text-muted
                    ">
                        {post.content.html ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content.html }} />
                        ) : (
                            <p>{post.content.text}</p>
                        )}
                    </div>
                </div>
            </article>

            <BlogFooter />
        </main>
    );
}

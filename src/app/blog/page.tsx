import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/hygraph';
import Navbar from '@/components/Navbar';
import BlogFooter from '@/components/BlogFooter';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <main className="min-h-screen text-text relative selection:bg-blue-100 selection:text-blue-900">
            <div className="fixed top-0 left-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
            <Navbar />

            <div className="pt-32 pb-24 px-8 w-full max-w-7xl mx-auto min-h-screen relative z-10">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col gap-4 items-center text-center">
                        <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-text/60 w-fit">
                            Our Blog
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold">Latest Updates</h1>
                        <p className="text-xl text-text-muted max-w-2xl">
                            Insights, updates, and stories from the SoterCare team.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col gap-4 bg-bg-card p-6 rounded-3xl shadow-m border border-black/5 hover:-translate-y-1 transition-all">
                                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100">
                                    {post.coverImage && (
                                        <Image
                                            src={post.coverImage.url}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-sm text-text-muted">
                                        <span>{new Date(post.publishedAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                        {post.author && (
                                            <>
                                                <span>•</span>
                                                <span>{post.author.name}</span>
                                            </>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-text-muted line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-blue-600 font-semibold flex items-center gap-2 mt-2 group-hover:gap-3 transition-all">
                                        Read Article <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center text-text-muted py-20">
                            <p>No posts found. Check back soon!</p>
                        </div>
                    )}


                </div>
            </div>

            <BlogFooter />
        </main>
    );
}

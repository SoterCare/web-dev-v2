import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/hygraph';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <main className="min-h-screen bg-[#fafafa] text-foreground">
            <Navbar />

            <div className="pt-32 pb-24 px-8 w-full max-w-7xl mx-auto min-h-screen">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col gap-4 items-center text-center">
                        <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 w-fit">
                            All Posts
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold">The SoterCare Blog</h1>
                        <p className="text-xl text-text-muted max-w-2xl">
                            Insights, updates, and stories from the SoterCare team.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-black/5 hover:shadow-md transition-all">
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
                                </div>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center text-text-muted py-20">
                            <p>No posts found. Check back soon!</p>
                        </div>
                    )}

                    <div className="flex justify-center mt-12">
                        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

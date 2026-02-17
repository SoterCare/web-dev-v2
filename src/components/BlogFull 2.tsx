import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/hygraph';
import { ArrowRight } from 'lucide-react';

export default async function BlogFull() {
    const posts = await getAllPosts();

    if (!posts || posts.length === 0) {
        return null; // Don't render section if no posts
    }

    return (
        <section id="blog" className="w-full py-24 md:py-32 bg-white relative z-10">
            <div className="w-full max-w-7xl mx-auto px-8">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col gap-4 items-center text-center">
                        <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 w-fit">
                            From Our Blog
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold">Latest Updates</h2>
                        <p className="text-xl text-text-muted max-w-2xl">
                            Stay updated with the latest news, health tips, and SoterCare announcements.
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
                                    <span className="text-blue-600 font-semibold flex items-center gap-2 mt-2 group-hover:gap-3 transition-all">
                                        Read Article <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

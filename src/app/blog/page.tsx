import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export default function BlogPage() {
    const posts = getBlogPosts();

    return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
                <p className="text-center text-text-muted text-lg max-w-2xl mx-auto">
                    Latest news, updates, and insights from the SoterCare team.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.slug} className="group cursor-pointer">
                        <article className="depth-card p-6 h-full flex flex-col hover:scale-[1.02] transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    Article
                                </span>
                                <time className="text-sm text-text-muted">
                                    {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>

                            <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {post.frontmatter.title}
                            </h2>

                            <p className="text-text-muted mb-6 flex-grow line-clamp-3">
                                {post.frontmatter.excerpt}
                            </p>

                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-black/5">
                                <span className="text-sm font-medium">Read more</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}

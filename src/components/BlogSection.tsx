import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const blogs = [
  {
    title: "Understanding Elderly Care Needs",
    category: "Care Tips",
    date: "Oct 15, 2025",
    image: "bg-cyan-100"
  },
  {
    title: "The Future of Smart Health Monitoring",
    category: "Technology",
    date: "Nov 02, 2025",
    image: "bg-blue-100"
  },
  {
    title: "Maintaining Independence in Senior Years",
    category: "Lifestyle",
    date: "Nov 10, 2025",
    image: "bg-purple-100"
  }
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
             <span className="bg-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/60 shadow-clay-inset">
               Insights
             </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Latest News & Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-foreground">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white rounded-[40px] overflow-hidden shadow-clay hover:shadow-clay-floating transition-all duration-300 group border border-white/60">
              <div className={`h-64 w-full ${blog.image} relative flex items-center justify-center opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500`}>
                <span className="text-foreground/50 font-bold bg-white/30 px-6 py-2 rounded-full backdrop-blur-md shadow-sm">Image Placeholder</span>
              </div>
              <div className="p-10">
                <div className="flex items-center text-xs text-muted mb-4 space-x-3 uppercase tracking-wider font-bold">
                  <span className="text-foreground bg-gray-100 px-3 py-1 rounded-full">{blog.category}</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight group-hover:underline decoration-1 underline-offset-4 transition-colors">
                  {blog.title}
                </h3>
                <Link href="#" className="inline-flex items-center text-foreground font-bold hover:text-black/70 transition-colors mt-auto group/link">
                  Read Article <ArrowRight size={18} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

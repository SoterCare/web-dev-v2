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
               <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-x font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                 Insights
               </span>
            </div>
            <h2 className="mb-6 tracking-tight">
              Latest News & Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-text">
            {blogs.map((blog, index) => (
              <div key={index} className="bg-bg-card rounded-[1rem] overflow-hidden shadow-m hover:-translate-y-[2px] transition-transform duration-200 group border-none">
                <div className={`h-64 w-full ${blog.image} relative flex items-center justify-center opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500`}>
                  <span className="text-text-muted/50 font-bold bg-white/30 px-6 py-2 rounded-full backdrop-blur-md shadow-sm">Image Placeholder</span>
                </div>
                <div className="p-10">
                  <div className="flex items-center text-xs text-text-muted mb-4 space-x-3 uppercase tracking-wider font-bold">
                    <span className="text-text bg-bg-panel px-3 py-1 rounded-full">{blog.category}</span>
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-6 leading-tight group-hover:underline decoration-1 underline-offset-4 transition-colors">
                    {blog.title}
                  </h3>
                  <Link href="#" className="inline-flex items-center text-text font-bold hover:text-text-muted transition-colors mt-auto group/link">
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

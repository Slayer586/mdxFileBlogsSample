import { getBlogs } from '@/lib/mdx';
import BlogList from '@/components/BlogList';

export default function Home() {
  const blogs = getBlogs();

  return (
    <div className="min-h-screen bg-[#0E1117] text-neutral-100 flex flex-col items-center">
      <BlogList initialBlogs={blogs} />
    </div>
  );
}

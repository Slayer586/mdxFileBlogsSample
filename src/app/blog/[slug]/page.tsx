import { getBlogBySlug, getBlogs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import CodeBlock from '@/components/mdx/CodeBlock';
import Image from 'next/image';

export async function generateStaticParams() {
  const blogs = getBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const { metadata, content } = blog;

  // Custom components for MDX rendering to match the modern theme
  const CustomComponents = {
    h1: (props: any) => <h1 className="text-4xl font-extrabold mt-8 mb-6 text-white" {...props} />,
    h2: (props: any) => <h2 className="text-3xl font-bold mt-8 mb-4 border-b border-neutral-800 pb-2 text-neutral-100" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-200" {...props} />,
    p: (props: any) => <p className="text-neutral-300 leading-relaxed mb-6" {...props} />,
    a: (props: any) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-400 transition-all font-medium" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2 marker:text-neutral-500" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside text-neutral-300 mb-6 space-y-2 marker:text-neutral-500" {...props} />,
    li: (props: any) => <li className="pl-2" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-blue-500/50 bg-blue-500/5 px-6 py-4 rounded-r-xl my-8 italic text-neutral-300" {...props} />
    ),
    pre: CodeBlock,
    code: (props: any) => <code className="bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props} />,
    img: (props: any) => (
      <span className="my-10 flex justify-center w-full">
        <img {...props} className="rounded-xl object-contain max-w-full h-auto border border-neutral-800 shadow-2xl" loading="lazy" />
      </span>
    ),
    Image: (props: any) => (
      <span className="my-10 flex justify-center w-full">
        <Image 
          {...props} 
          width={props.width || 1200} 
          height={props.height || 630} 
          className={`rounded-xl border border-neutral-800 shadow-2xl ${props.className ? props.className : 'object-contain max-w-full h-auto'}`} 
        />
      </span>
    ),
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>
        
        <article>
          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              {metadata.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
                <Calendar className="w-4 h-4" />
                <time dateTime={metadata.date}>{metadata.date}</time>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
                <User className="w-4 h-4" />
                {metadata.author}
              </div>
            </div>
            
            <p className="mt-8 text-xl text-neutral-300 leading-relaxed border-l-2 border-blue-500 pl-6">
              {metadata.description}
            </p>
          </header>

          <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
            <MDXRemote source={content} components={CustomComponents} />
          </div>
        </article>
      </div>
    </div>
  );
}

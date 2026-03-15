'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogMetadata } from '@/lib/mdx';

export default function BlogList({ initialBlogs }: { initialBlogs: BlogMetadata[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  // Categories (hardcoded for UI demo replicating the screenshot)
  const categories = ['Recent', 'Architecture', '.NET', 'ASP.NET Core', 'EF Core', 'C#', 'Tests', 'Databases'];
  const [activeCategory, setActiveCategory] = useState('Recent');

  // Filter blogs based on search query and category
  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Recent' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header & Controls Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight">Explore the newsletters</h2>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm ${
                activeCategory === cat 
                  ? 'bg-[#5a48ef] text-white shadow-[#5a48ef]/30' 
                  : 'bg-[#eeeffc] text-[#5a48ef] hover:bg-[#d8dcf9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search blogs"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="flex-1 bg-white text-neutral-900 px-5 py-3.5 rounded-lg outline-none focus:ring-2 focus:ring-[#5a48ef] border border-neutral-200 shadow-sm text-base font-medium placeholder:text-neutral-400"
          />
          <button className="bg-[#5a48ef] hover:bg-[#4a39d8] text-white px-10 py-3.5 rounded-lg font-semibold transition-colors shadow-md shadow-[#5a48ef]/20">
            Search
          </button>
        </div>
        
        <p className="text-neutral-300 font-semibold text-base">{filteredBlogs.length} blogs found</p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {currentBlogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="group block">
            <div className="flex flex-col rounded-2xl overflow-hidden bg-[#161b22] border border-neutral-800/50 shadow-xl group-hover:shadow-[0_8px_30px_rgb(90,72,239,0.12)] transition-all duration-300 group-hover:-translate-y-1 h-full">
              
              {/* Image Header */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-950">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b1c3e] to-[#0f1025]">
                    <span className="text-white/30 font-bold uppercase tracking-widest text-sm">No Cover</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 text-[13px] font-semibold text-neutral-400">
                  <time dateTime={blog.date}>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  {blog.category && (
                    <span className="bg-neutral-800/60 px-2.5 py-0.5 rounded-full text-neutral-300">
                      {blog.category.toLowerCase()}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-neutral-100 leading-snug mb-3 group-hover:text-[#8075ff] transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-[14px] text-neutral-400 leading-relaxed line-clamp-3 mt-auto">
                  {blog.description}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-20">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-neutral-300"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                  currentPage === i + 1
                    ? 'bg-[#5a48ef] text-white shadow-[#5a48ef]/30'
                    : 'bg-neutral-900 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-neutral-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

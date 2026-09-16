import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Share2,
  Tag,
  CheckCircle2,
  X,
  FileText,
  Building
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  onAddGuestPost?: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = [
    'All',
    'University Comparison',
    'Admission Strategy',
    'Merit & Tests',
    'Scholarships'
  ];

  const filteredPosts = posts
    .filter((post) => !post.sponsored)
    .filter((post) => {
      if (selectedCategory === 'All') return true;
      return post.category === selectedCategory;
    });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
              Pakistani Admissions & Entry Test Insights
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Authentic, data-backed admission guides, university comparison breakdowns, and scholarship secrets written by top alumni and academic advisors.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {post.category}
                </span>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              <h3
                onClick={() => setActivePost(post)}
                className="font-extrabold text-base text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors font-serif leading-snug"
              >
                {post.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-[10px] text-emerald-800">
                  {post.author.charAt(0)}
                </div>
                <div className="truncate max-w-[120px]">
                  <span className="font-bold text-slate-800 block truncate text-[11px]">
                    {post.author}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {post.date}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePost(post)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Read Article Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {activePost.category}
                  </span>
                  <span className="text-xs text-slate-500">• {activePost.date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  {activePost.title}
                </h2>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                  <span>By <strong>{activePost.author}</strong> ({activePost.authorRole})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed prose prose-emerald max-w-none">
              <div className="whitespace-pre-line font-sans text-slate-700 space-y-3">
                {activePost.content}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

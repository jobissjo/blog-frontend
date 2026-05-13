import React from 'react';
import { Blog } from '@/types/blog';
import BlogCard from '@/components/BlogCard';

interface RelatedBlogsProps {
  blogs: Blog[];
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Related Articles</h2>
          <p className="text-muted-foreground mt-2">More stories you might enjoy</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="h-full">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;

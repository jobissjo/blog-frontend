import { Blog } from "@/types/blog";

// Mock data storage
let blogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-react-typescript",
    content: `# Getting Started with React and TypeScript

TypeScript has become an essential tool for modern React development. In this comprehensive guide, we'll explore how to set up and use TypeScript in your React projects.

## Why TypeScript?

TypeScript adds static typing to JavaScript, which helps catch errors during development rather than at runtime. This leads to more robust and maintainable code.

### Key Benefits

1. **Type Safety**: Catch errors before they reach production
2. **Better IDE Support**: Enhanced autocomplete and intellisense
3. **Improved Refactoring**: Rename symbols with confidence
4. **Self-Documenting Code**: Types serve as inline documentation

## Setting Up Your Project

You can create a new React + TypeScript project using Vite:

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
\`\`\`

This gives you a modern development setup with hot module replacement and optimized builds.

## Conclusion

TypeScript might seem overwhelming at first, but the benefits far outweigh the initial learning curve. Start small, add types gradually, and enjoy the improved developer experience!`,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    published: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    tags: ["React", "TypeScript", "Web Development"],
    likes: 42,
  },
  {
    id: "2",
    title: "Building Scalable Backend APIs with FastAPI",
    slug: "building-scalable-backend-apis-fastapi",
    content: `# Building Scalable Backend APIs with FastAPI

FastAPI is a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Why FastAPI?

FastAPI combines the best of several worlds:
- **Fast**: Very high performance, on par with NodeJS and Go
- **Fast to code**: Increase development speed
- **Fewer bugs**: Reduce human-induced errors
- **Intuitive**: Great editor support with autocomplete

## Basic Example

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
\`\`\`

## Key Features

1. Automatic interactive API documentation
2. Data validation using Pydantic
3. Async support out of the box
4. Dependency injection system

FastAPI makes it incredibly easy to build production-ready APIs quickly!`,
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    published: true,
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    tags: ["Python", "FastAPI", "Backend"],
    series_id: "1",
    likes: 38,
  },
  {
    id: "3",
    title: "MongoDB Best Practices for Production",
    slug: "mongodb-best-practices-production",
    content: `# MongoDB Best Practices for Production

MongoDB is a powerful NoSQL database, but it requires careful planning to use effectively in production.

## Schema Design

Even though MongoDB is schema-less, you should still design your data structure carefully:

- Embed related data that's frequently accessed together
- Reference data that's accessed independently
- Consider the 16MB document size limit

## Indexing Strategy

Proper indexing is crucial for performance:

\`\`\`javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.posts.createIndex({ userId: 1, createdAt: -1 })
\`\`\`

## Connection Pooling

Always use connection pooling in production:
- Reduces connection overhead
- Improves response times
- Better resource utilization

## Monitoring

Set up monitoring for:
- Query performance
- Index usage
- Replication lag
- Disk usage

Following these practices will help you build robust MongoDB applications!`,
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    published: false,
    created_at: "2024-01-25T09:15:00Z",
    updated_at: "2024-01-25T09:15:00Z",
    tags: ["MongoDB", "Database", "Backend"],
    series_id: "1",
    likes: 15,
  },
];

export const blogService = {
  // Get all blogs (admin sees all, public sees only published)
  getAllBlogs: (isAdmin: boolean = false): Blog[] => {
    if (isAdmin) {
      return [...blogs].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return blogs
      .filter(blog => blog.published)
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  },

  // Get blog by slug
  getBlogBySlug: (slug: string): Blog | undefined => {
    return blogs.find(blog => blog.slug === slug);
  },

  // Get blog by ID
  getBlogById: (id: string): Blog | undefined => {
    return blogs.find(blog => blog.id === id);
  },

  // Create new blog
  createBlog: (blog: Omit<Blog, "id" | "created_at" | "updated_at" | "likes">): Blog => {
    const newBlog: Blog = {
      ...blog,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes: 0,
    };
    blogs.push(newBlog);
    return newBlog;
  },

  // Update blog
  updateBlog: (id: string, updates: Partial<Blog>): Blog | undefined => {
    const index = blogs.findIndex(blog => blog.id === id);
    if (index === -1) return undefined;

    blogs[index] = {
      ...blogs[index],
      ...updates,
      id: blogs[index].id, // Prevent ID change
      updated_at: new Date().toISOString(),
    };
    return blogs[index];
  },

  // Delete blog
  deleteBlog: (id: string): boolean => {
    const index = blogs.findIndex(blog => blog.id === id);
    if (index === -1) return false;

    blogs.splice(index, 1);
    return true;
  },

  // Toggle publish status
  togglePublish: (id: string): Blog | undefined => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return undefined;

    blog.published = !blog.published;
    blog.updated_at = new Date().toISOString();
    return blog;
  },

  // Increment likes
  incrementLikes: (id: string): Blog | undefined => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return undefined;

    blog.likes += 1;
    return blog;
  },

  // Get blogs by series
  getBlogsBySeries: (seriesId: string): Blog[] => {
    return blogs
      .filter(blog => blog.series_id === seriesId && blog.published)
      .sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  },

  // Search blogs
  searchBlogs: (query: string, isAdmin: boolean = false): Blog[] => {
    const searchTerm = query.toLowerCase();
    const blogsToSearch = isAdmin ? blogs : blogs.filter(b => b.published);
    
    return blogsToSearch.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.content.toLowerCase().includes(searchTerm) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },
};

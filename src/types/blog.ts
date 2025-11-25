export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  series_id?: string;
  likes: number;
}

export interface Series {
  _id: string;
  id?: string; // Compatibility field, same as _id
  title: string;
  slug: string;
  description: string;
  published: boolean;
  blogs?: Blog[];
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  blog_id: string;
  name: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  visitor_id?: string | null;
}

export interface User {
  id: string;
  isAdmin: boolean;
}

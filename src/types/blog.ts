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
  view_count?: number;
  // author_name?: string;
  // author_portfolio?: string;
  user_details?: UserDetails;
  liked?: boolean;
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
  username: string;
  comment: string;
  created_at: string;
}

export interface User {
  id: string;
  isAdmin: boolean;
}

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  role: string;
  profile?: Profile;
}

export interface Profile {
  image: string;
  portfolio_link: string;
}
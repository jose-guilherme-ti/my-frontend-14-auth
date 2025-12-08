// ==========================
// Tipos principais
// ==========================

export interface Author {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  author: Author;
}

// ==========================
// Query: posts
// ==========================
export interface QueryPostsResponse {
  posts: Post[];
}

// ==========================
// Subscription: postCreated
// ==========================
export interface SubscriptionPostCreatedResponse {
  postCreated: Post;
}

// ==========================
// CREATE_POST Mutation
// ==========================
export interface CreatePostVariables {
  title: string;
  content: string;
}

export interface CreatePostResponse {
  createPost: Post;
}

// ==========================
// PUBLISH_POST Mutation
// ==========================
export interface PublishPostVariables {
  id: number;
  published: boolean;
}

export interface PublishPostResponse {
  publishPost: Pick<Post, "id" | "published">;
}

// ==========================
// PostCard Props
// ==========================
export interface PostCardProps {
  post: Post;
  onUpdate: (updated: { id: number; published: boolean }) => void;
}
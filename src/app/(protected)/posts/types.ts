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
// Query: GetPublishedPosts
// ==========================
export interface QueryPublishedPostsVariables {
  isPublished?: boolean;
}

export interface QueryPublishedPostsResponse {
  posts: Post[];
}

// ==========================
// Subscription: postPublish
// ==========================
export interface SubscriptionPostPublishResponse {
  postPublish: Post;
}

// ==========================
// Props do componente PostCard
// ==========================
export interface PostCardProps {
  post: Post;
  highlight?: boolean;
}

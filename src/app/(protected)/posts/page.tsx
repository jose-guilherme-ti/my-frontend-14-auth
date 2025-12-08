"use client";

import React, { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useSubscription } from "@apollo/client/react";
import { Container, Typography, Grid, CircularProgress, Alert, Chip, Box } from "@mui/material";
import PostCard from "@/components/PostCard";
import { QueryPublishedPostsResponse, QueryPublishedPostsVariables, Post, SubscriptionPostPublishResponse } from "./types";
import { medievalPostPublicados } from "./styles";

const QUERY_PUBLISHED_POSTS = gql`
  query GetPublishedPosts($isPublished: Boolean) {
    posts(published: $isPublished) {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`;

const SUB_POST_PUBLISH = gql`
  subscription {
    postPublish {
      id
      title
      content
      published
      author { id name }
    }
  }
`;

export default function PostsPage() {
  const { data, loading, error } = useQuery<
    QueryPublishedPostsResponse,
    QueryPublishedPostsVariables
  >(QUERY_PUBLISHED_POSTS, {
    variables: { isPublished: true },
    fetchPolicy: "network-only",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  useEffect(() => {
    if (!data?.posts) return;

    const newList = data.posts.filter(p => p.published === true);

    setPosts(prev => {
      // Primeiro carregamento
      if (prev.length === 0) return newList;

      // Atualização posterior → mescla o que falta
      const merged = [...prev];

      console.table(merged)
      console.table(newList)

      newList.forEach(post => {
        const exists = merged.some(p => p.id === post.id);
        if (!exists) merged.push(post);
      });
      console.log("Sem o merge")
      // 🔥 Remove os que viraram false
      return merged.filter(p => p.published === true);
    });
  }, [data]);



/* 
  useEffect(() => {
    console.log('posts:', posts)
  }, [posts]) */

  useSubscription<SubscriptionPostPublishResponse>(SUB_POST_PUBLISH, {
    onData: ({ data }) => {
      const newPost = data?.data?.postPublish;
      if (!newPost) return;

      // 🔥 Se virou false → remove do estado
      if (newPost.published === false) {
        setPosts(prev => prev.filter(p => p.id !== newPost.id));
        return;
      }

      // 🔥 Se published = true → entra no topo
      setPosts(prev => {
        const exists = prev.some(p => p.id === newPost.id);
        if (exists) {
          // Atualiza os dados (caso edite título antes de publicar etc.)
          return prev.map(p => (p.id === newPost.id ? newPost : p));
        }

        setHighlightId(newPost.id);
        setTimeout(() => setHighlightId(null), 3000);

        return [newPost, ...prev]; // topo
      });
    },
  });

  if (loading)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Erro: {error.message}</Alert>
      </Container>
    );

  return (
    <Container sx={{ mt: 4, }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Posts Publicados
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post: any) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Box
              sx={medievalPostPublicados(highlightId === post.id).postCardWrapper}
            >
              {highlightId === post.id && (
                <Chip
                  label="NOVO!"
                  color="warning"
                  size="small"
                  sx={medievalPostPublicados().highlight}
                />
              )}


              {/* Card existente dentro do layout medieval */}
              <PostCard post={post} highlight={highlightId === post.id} />
            </Box>

          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

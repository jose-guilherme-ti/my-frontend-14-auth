"use client";

import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material";

// Mutation GraphQL
const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      published
    }
  }
`;

export default function CreatePostFormMUI() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      setSuccessMessage(`Post "${data.createPost.title}" criado com sucesso!`);
      setTitle("");
      setContent("");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim() || !content.trim()) {
      setErrorMessage("Título e conteúdo são obrigatórios.");
      return;
    }

    await createPost({ variables: { title, content } });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Criar novo post
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={5}
          required
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Criar Post
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
      </form>
    </Box>
  );
}

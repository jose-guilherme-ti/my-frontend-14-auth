"use client";

import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";

import {
    Container,
    TextField,
    Box,
    Grid,
    CircularProgress,
    Alert,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Chip,
    Typography,
} from "@mui/material";

import {
    CreatePostResponse,
    CreatePostVariables,
    Post,
    PostCardProps,
    PublishPostResponse,
    PublishPostVariables,
    QueryPostsResponse,
    SubscriptionPostCreatedResponse
} from "./types";
import { medievalCard, medievalCreatePosts } from "./styles";





// ------------------------------------------------------------
// QUERIES / MUTATIONS / SUBSCRIPTIONS
// ------------------------------------------------------------

const QUERY_POSTS = gql`
  query {
    posts {
      id
      title
      content
      published
      author { id name }
    }
  }
`;

const SUB_POST_CREATED = gql`
  subscription {
    postCreated {
      id
      title
      content
      published
      author { id name }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      published
      author { id name }
    }
  }
`;

const PUBLISH_POST = gql`
  mutation PublishPost($id: Int!, $published: Boolean!) {
    publishPost(id: $id, published: $published) {
      id
      published
    }
  }
`;


// ------------------------------------------------------------
// CARD MEDIEVAL
// ------------------------------------------------------------
function PostCard({ post, onUpdate }: PostCardProps) {
    const [publishPost, { loading }] = useMutation<
        PublishPostResponse,
        PublishPostVariables
    >(PUBLISH_POST, {
        onError: (err) => alert("Erro ao publicar: " + err.message),
        onCompleted: (data) => {
            onUpdate(data.publishPost);
        },
    });

    return (
        <Card sx={medievalCard.outer}>
           

            {/* Conteúdo */}
            <Box sx={medievalCard.contentBox}>
                <Typography sx={medievalCard.header}>{post.title}</Typography>

                <Box sx={medievalCard.divider} />

                <Typography
                    sx={{
                        fontFamily: "'Times New Roman', serif",
                        color: "#3d2b1a",
                    }}
                >
                    {post.content}
                </Typography>

                {/* Autor */}
                <Box sx={medievalCard.authorRow}>
                    <span style={{ fontSize: "1.3rem" }}>👤</span>
                    <Typography
                        sx={{
                            fontFamily: "'Times New Roman', serif",
                            fontWeight: "bold",
                        }}
                    >
                        {post.author.name}
                    </Typography>
                </Box>

                {/* Badge Publicado */}
                {post.published && (
                    <Typography sx={medievalCard.badgePublished}>
                        ✔ PUBLICADO
                    </Typography>
                )}
            </Box>

            {/* Botão Publicar */}
            <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    sx={{
                        background: "#6b4a2e",
                        ":hover": { background: "#4a331f" },
                        fontFamily: "'Times New Roman', serif",
                        fontWeight: "bold",
                    }}
                    onClick={() =>
                        publishPost({
                            variables: { id: post.id, published: !post.published },
                        })
                    }
                >
                    {post.published ? "Despublicar" : "Publicar"}
                </Button>
            </CardActions>
        </Card>

    );
}



// ------------------------------------------------------------
// DASHBOARD PRINCIPAL
// ------------------------------------------------------------
export default function PostsDashboard() {
    const { data, loading, error } = useQuery<QueryPostsResponse>(QUERY_POSTS);

    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [createPost, { loading: creating }] = useMutation<
        CreatePostResponse,
        CreatePostVariables
    >(CREATE_POST, {
        onCompleted: (data) => {
            setSuccessMessage(`Post "${data.createPost.title}" criado!`);
            setTitle("");
            setContent("");
        },
        onError: (err) => setErrorMessage(err.message),
    });

    useEffect(() => {
        if (data?.posts) setPosts(data.posts);
    }, [data]);


    // Subscription
    useSubscription<SubscriptionPostCreatedResponse>(SUB_POST_CREATED, {
        onData: ({ data }) => {
            const newPost = data?.data?.postCreated;
            if (newPost) setPosts((prev) => [newPost, ...prev]);
        },
        onError: (err) => console.log("❌ SUB ERROR:", err),
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!title.trim() || !content.trim())
            return setErrorMessage("Título e conteúdo obrigatórios.");
        await createPost({ variables: { title, content } });
    };


    if (loading)
        return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

    if (error)
        return <Alert severity="error">{error.message}</Alert>;


    return (
        <Container maxWidth="lg" sx={{ mt: 4, fontFamily: "'Times New Roman', serif" }}>

            {/* Título Medieval */}
            <Typography
                variant="h4"
                sx={medievalCreatePosts.header}
            >
                Criar Post (Estilo Medieval)
            </Typography>


            {/* Alerts */}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}


            {/* Formulário Medieval */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={medievalCreatePosts.box}
            >
                <Typography
                    variant="h5"
                    sx={medievalCreatePosts.title}
                >
                    Criar Novo Pergaminho
                </Typography>

                <TextField
                    label="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    sx={medievalCreatePosts.textField}
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
                    sx={medievalCreatePosts.textField}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={creating}
                    sx={medievalCreatePosts.button}
                >
                    {creating ? "Escrevendo..." : "Criar Post"}
                </Button>
            </Box>



            {/* Título lista */}
            <Typography
                variant="h4"
                sx={medievalCreatePosts.titlePost}
            >
                Posts (Estilo Medieval)
            </Typography>


            {/* Lista de Cards */}
            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4}  key={post.id}>
                        <PostCard
                            post={post}
                            onUpdate={(updatedPost) =>
                                setPosts((prev) =>
                                    prev.map((p) =>
                                        p.id === updatedPost.id
                                            ? { ...p, published: updatedPost.published }
                                            : p
                                    )
                                )
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, getBlogImage } from "./api"; // Adjust imports as needed
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import BlogInteractions from "./BlogInteractions";

const BlogDetail = ({ currentUser }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/api/blog/fetchOne/${id}`);
        setPost(res.data);
      } catch (err) {
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post) return <Typography>Post not found</Typography>;

  return (
  
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, boxShadow: 3, borderRadius: 2, }}>
     
      {post.img && (
        <CardMedia
          component="img"
          image={getBlogImage(post.img)}
          alt={post.title}
          sx={{ height: 250, objectFit: "contain",mt:1 }}
        />
      )}
      <CardContent>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{textAlign:"center",fontSize:{xs:"1.4rem",md:"2rem",lg:"2.6rem"}}}>
          {post.title}
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph sx={{fontSize:{xs:"1rem",md:"1.5rem",lg:"2rem"}}}>
          {post.description} 
        </Typography>
        <Box sx={{ mt: 1, mb: 1 }}>
          {post.categories.map((cat) => (
            <Chip
              key={cat}
              label={cat.toUpperCase()}
              size="small"
              color="primary"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
       
        <BlogInteractions post={post} currentUser={currentUser} />
      </CardContent>
    </Card>
    
  );
};

export default BlogDetail;
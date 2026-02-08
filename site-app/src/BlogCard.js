import React from "react";
import { getBlogImage } from "./api";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import BlogInteractions from "./BlogInteractions"; 

const BlogCard = ({ post, currentUser }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
      {post.img && (
        <CardMedia
          component="img"
          image={getBlogImage(post.img)}
          alt={post.title}
          sx={{
            height: 200,
            objectFit: "contain",
            mt: 1,
          }}
        />
      )}
      <CardContent>
       
          <Typography variant="h5" gutterBottom fontWeight="bold" 
          sx={{textAlign:"center",}}>
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize:{xs:"1rem",md:"1.5rem",lg:"2rem"},
              fontWeight:"bold",
            }}
          >
            {post.description}
          </Typography>
 
        <Box sx={{ mt: 1, mb: 1,display:"flex",justifyContent:"space-between" }}>
          {post.categories.map((cat) => (
            <Chip
              key={cat}
              label={cat.toUpperCase()}
              size="small"
              color="primary"
              sx={{ mr: 1, mb: 1 }}
            />
            
          ))}
          <Box>
             <Link to={`/blog/${post._id}`} style={{textDecoration:"none"}}>
             <Chip      
              label="READ MORE"
              size="large"
              color="primary"
              sx={{ mr: 2, mb: 1 }}
            />
            </Link>
          </Box>
        </Box>
        <BlogInteractions post={post} currentUser={currentUser} />
      </CardContent>
    </Card>
  );
};

export default BlogCard;
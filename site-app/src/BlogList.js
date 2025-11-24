import React from 'react';
import {useState, useEffect} from 'react';
import {API} from './api';
import { Container, Box } from "@mui/material";
import BlogCard from "./BlogCard";
import { useAuth } from "./AuthContext";

  const BlogList = ({category}) => { 

  const {user}  = useAuth(); // ← from context
  const [blogs, setBlogs] = useState([]);

  

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await API.get(`/api/fetchAll?category=${category}`);
      setBlogs(res.data.blogs);
    };
    fetchBlogs();
  }, [category]);
 
  
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
   
      <Box sx={{ mt: 1 }}>
      {blogs.map(blog => (
        <BlogCard key={blog._id} post={blog} currentUser={user} />
      ))}
      </Box>
    </Container>
  );
};

export default BlogList;
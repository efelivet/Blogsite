import React from 'react';
import {useState, useEffect} from 'react';
import {API} from './api';
import { Container, Box , CircularProgress, Typography} from "@mui/material";
import BlogCard from "./BlogCard";
import { useAuth } from "./AuthContext";

  const BlogList = ({category}) => { 

  const {user}  = useAuth(); 
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);    
  
  console.log("this is user",user)

useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);  
      
      try {
        const res = await API.get(`/api/fetchAll?category=${category}`);
        
   
        if (res.data && res.data.blogs) {
          setBlogs(res.data.blogs);
        } else {
          setBlogs([]); 
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

 
  if (error) {
    return (
      <Container sx={{ py: 2 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }
  return (
    <Container  sx={{ py: 2 }}>
   
      <Box sx={{ mt: 1 }}>
      {blogs.map(blog => (
        <BlogCard key={blog._id} post={blog} currentUser={user} />
      ))}
      </Box>
    </Container>
  );
};

export default BlogList;
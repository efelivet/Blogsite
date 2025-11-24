import React, { useState } from "react";
import {API} from './api'
import {useNavigate, Link} from "react-router-dom"

import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const Post = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    categories: "", // e.g., "tech, news, sport"
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // Handle text inputs
  const handleText = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("categories", form.categories);
    if (form.image) data.append("img", form.image);


    try {
      await API.post("/api/blogs", data);
      setMessage({ text: "Blog created!", type: "success" });
      setForm({ title: "", description: "", categories: "", image: null });
      setPreview("");
      setTimeout(()=> navigate("/fetchAll"),100)
     
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to create blog",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container > 
      <Link to ="/">Home</Link>
    <Paper elevation={3} sx={{ p: 2, maxWidth: 400, mx: "auto", mt: 4 }}>
     
      <Typography  gutterBottom sx ={{fontSize:12,textAlign:"center"}}>
        Create New Blog
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 1 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleText}
          required
          margin="normal"
         
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleText}
          required
          
          rows={3}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Categories"
          name="categories"
          value={form.categories}
          onChange={handleText}
          placeholder="tech, news, sport, videos"
          margin="normal"
        />

        {/* FIXED FILE UPLOAD BUTTON */}
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          fullWidth
          sx={{ mt: 2, mb: 1 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFile}
          />
        </Button>

        {/* Image Preview */}
        {preview && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 250,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : "Create Blog"}
        </Button>
      </Box>
    </Paper>
    </Container>
  );
};



export default Post;
 // src/components/SingleBlog.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {API} from "./api";
import {
  Container,
  Typography,
  CardContent,
  CardMedia,
  CircularProgress,
  Stack,
  Chip,
  Box,
  Button,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  Comment,
  Share,
  Person,
  CalendarMonth,
  Edit,
  Delete,
} from "@mui/icons-material";

const SingleBlog = () => {
  const { id } = useParams(); // get id from URL
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "" });

  // Fetch single blog from backend
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/api/fetchOne/${id}`);
        setBlog(res.data);
        setEditData({
          title: res.data.title,
          description: res.data.description,
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  // ✅ Handle Delete (send DELETE request with ID)
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/delete/${id}`);
      setOpenDelete(false);
      navigate("/fetchAll"); // redirect after successful deletion
    } catch (err) {
      console.error("Error deleting blog:", err);
      setOpenDelete(false);
    }
  };

  // ✅ Handle Edit (send PUT request with ID and updated data)
  const handleEdit = async () => {
    try {
      const res = await API.put(`/api/update/${id}`, editData);
      setBlog(res.data); // update UI with edited data
      setOpenEdit(false);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  // UI Loading State
  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 10 }} />;
  }

  if (!blog) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 5 }}>
        Blog not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          mb: 3,
          textTransform: "none",
          borderRadius: "20px",
          px: 2.5,
        }}
      >
        Back to All Blogs
      </Button>

      <Paper
        elevation={4}
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {/* Edit & Delete Buttons */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
        >
          <Tooltip title="Edit Blog">
            <IconButton
              color="primary"
              onClick={() => setOpenEdit(true)}
              sx={{
                backgroundColor: "#f5f5f5",
                "&:hover": { backgroundColor: "#e0f2ff" },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Blog">
            <IconButton
              color="error"
              onClick={() => setOpenDelete(true)}
              sx={{
                backgroundColor: "#f5f5f5",
                "&:hover": { backgroundColor: "#ffe0e0" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Blog Image */}
        {blog.img && (
          <CardMedia
            component="img"
            image={`/img/${blog.img}`}
            alt={blog.title}
            sx={{
              height: { xs: 250, sm: 400 },
              objectFit: "cover",
            }}
          />
        )}

        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Blog Title */}
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {blog.title}
          </Typography>

          {/* Author and Date */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Person fontSize="small" />
              <Typography variant="body2">
                {blog.author?.username || "Unknown Author"}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarMonth fontSize="small" />
              <Typography variant="body2">
                {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
            </Stack>
          </Stack>

          {/* Blog Categories */}
          {blog.categories?.length > 0 && (
            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
              {blog.categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  color="primary"
                  size="small"
                  sx={{ borderRadius: "8px" }}
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Blog Description */}
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              fontSize: "1.05rem",
              color: "text.primary",
              whiteSpace: "pre-line",
            }}
          >
            {blog.description}
          </Typography>

          {/* Blog Stats */}
          <Box mt={5}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                startIcon={<Favorite />}
                size="small"
                sx={{ color: "error.main", textTransform: "none" }}
              >
                {blog.likesCount || 0} Likes
              </Button>
              <Button
                startIcon={<Comment />}
                size="small"
                sx={{ color: "primary.main", textTransform: "none" }}
              >
                {blog.comments?.length || 0} Comments
              </Button>
              <Button
                startIcon={<Share />}
                size="small"
                sx={{ color: "text.secondary", textTransform: "none" }}
              >
                {blog.shares || 0} Shares
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog post? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={()=>handleDelete(id)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Title"
              fullWidth
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              multiline
              minRows={5}
              fullWidth
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SingleBlog;

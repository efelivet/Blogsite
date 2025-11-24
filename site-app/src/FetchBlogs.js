 import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import {API} from "./api";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Pagination,
} from "@mui/material";
import { Search, Clear, Favorite, Comment, Share } from "@mui/icons-material";

const CATEGORIES = ["tech", "news", "sport", "videos"];

const FetchBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCats, setSelectedCats] = useState(
    searchParams.get("categories")?.split(",") || []
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  // 🔹 Debounced effect for updating URL params
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = {};
      if (search) params.q = search;
      if (selectedCats.length > 0) params.categories = selectedCats.join(",");
      if (page > 1) params.page = page;

      setSearchParams(params);
    }, 500); // ⏱️ debounce delay

    return () => clearTimeout(handler);
  }, [search, selectedCats, page, setSearchParams]);

  // 🔹 Fetch blogs when searchParams change
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/fetchAll", { params: searchParams });
        setBlogs(res.data.blogs);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [searchParams]);

  // 🔹 Category toggle handler
  const handleCategoryToggle = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  // 🔹 Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setSelectedCats([]);
    setPage(1);
  };


   const handleBlogClick = (id) => {
    navigate(`/fetchOne/${id}`);
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx ={{display:"flex",justifyContent:"space-between"}}>
      <Typography variant="h4" gutterBottom>
        All Blogs
      </Typography>
      <Typography variant="Body2" gutterBottom>
         <Link to ="/">Home</Link>
      </Typography>
       </Box>
      {/* 🔹 Filter Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          {/* 🔍 Search Input */}
          <TextField
            size="small"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* 🏷️ Category Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                color={selectedCats.includes(cat) ? "primary" : "default"}
                onClick={() => handleCategoryToggle(cat)}
                clickable
                size="small"
              />
            ))}
          </Stack>

          {(search || selectedCats.length > 0) && (
            <Button variant="outlined" size="small" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
        </Stack>
      </Paper>

      {/* 🔹 Blog Grid */}
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id} sx ={{maxWidth:300}}>
            <Card elevation={3}  sx={{ cursor: "pointer" }}
              onClick={() => handleBlogClick(blog._id)}>
              {blog.img && (
                <CardMedia
                  component="img"
                  height="500"
                  image={`http://localhost:5000/Public/img/${blog.img}`}
                  alt={blog.title}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <CardContent>
                <Typography variant="h6" noWrap>
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {blog.description.substring(0, 100)}...
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {blog.categories.map((cat) => (
                    <Chip key={cat} label={cat} size="small" color="primary" />
                  ))}
                </Stack>

                <Typography variant="caption" display="block" gutterBottom>
                  By <strong>{blog.author?.username || "Unknown"}</strong>
                </Typography>

                <Stack direction="row" spacing={2} mt={2}>
                  <Button startIcon={<Favorite />} size="small">
                    {blog.likesCount || 0}
                  </Button>
                  <Button startIcon={<Comment />} size="small">
                    {blog.comments?.length || 0}
                  </Button>
                  <Button startIcon={<Share />} size="small">
                    {blog.shares || 0}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default FetchBlogs;

// src/components/BlogCard.jsx
import React, { useState, useEffect } from "react";
import {API} from "./api";
import { getBlogImage } from './api';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  TextField,
  Button,
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  Send,
  Delete,
  Edit,
  Save,
  Close,
} from "@mui/icons-material";

const BlogCard = ({ post, currentUser }) => {
  // ---------- Like ----------
  const [liked, setLiked] = useState(post.likes.includes(currentUser?.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
 
  const handleLike = async () => {
   if (!currentUser) {
    alert("Please login to like this post.");
    return;
  }

  const wasLiked = liked; setLiked(!wasLiked); 
  setLikeCount(wasLiked ? likeCount - 1 : likeCount + 1);

    try {

       

      const res = await API.post(`/api/${post._id}/like`);

       // Update state based entirely on backend response
    setLikeCount(res.data.likes);
    setLiked(res.data.liked);
    } catch (err) {
       setLiked(wasLiked); 
       setLikeCount(wasLiked ? likeCount + 1 : likeCount - 1);
    }
  };

  // ---------- Share ----------
  const handleShare = async () => {
    const url = `${window.location.origin}/api/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (err) {
        if (err.name !== "AbortError") fallbackCopy(url);
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      prompt("Copy link:", url);
    }
  };

  // ---------- Comment ----------
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // ← Should later load from backend
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await API.get(`/api/${post._id}/comment`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };
  fetchComments();
}, [post._id]);

  const handleSubmitComment = async () => {
    if (!currentUser) {
      alert("Please login to post a comment.");
      return;
    }
    if (!commentText.trim() || loadingComment) return;

    setLoadingComment(true);
    const text = commentText.trim();
    setCommentText("");
    setShowCommentBox(false);

    try {
      const res = await API.post(`/api/${post._id}/comment`, { text });
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setLoadingComment(false);
    }
  };

  // ---------- Delete Comment ----------
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/api/${post._id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  // ---------- Edit Comment ----------
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const res = await API.put(`/api/${post._id}/comment/${commentId}`, {
        text: editingText.trim(),
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data : c))
      );
      cancelEditing();
    } catch (err) {
      alert("Failed to update comment");
    }
  };

  return (
    <Card sx={{maxWidth:{xs:600,md:1000} ,  mx: "auto", mb: 2,
     boxShadow: 3, borderRadius: 2 }}>
      {/* Image */}
      {post.img && (
        <CardMedia
          component="img"
         image={getBlogImage(post.img)}
          alt={post.title}
           sx={{
       
        height: 200,     
        objectFit: "contain", 
        mt:1,
      }}
        />
      )}

      <CardContent >
        <Typography variant="h5" gutterBottom fontWeight="bold" >
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
          }}
        >
          {post.description}
        </Typography>

        {/* Categories */}
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

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
          
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Tooltip title={liked ? "Unlike" : "Like"}>
            <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
              {liked ? <Favorite /> : <FavoriteBorder />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {likeCount}
              </Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Comment">
            <IconButton onClick={() => setShowCommentBox(!showCommentBox)} color="primary">
              <Comment />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {comments.length}
              </Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton onClick={handleShare} color="primary">
              <Share />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {post.shares}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Comment Input */}
        <Collapse in={showCommentBox}>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              placeholder="Write a comment..."
              variant="outlined"
              size="small"
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmitComment()}
              autoFocus
              disabled={loadingComment}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button size="small" onClick={() => setShowCommentBox(false)} disabled={loadingComment}>
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || loadingComment}
                startIcon={loadingComment ? <></> : <Send />}
              >
                {loadingComment ? "Posting..." : "Post"}
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Comments List */}
        {comments.length === 0 ? (
        null
        ) : (
          <List sx={{ mt: 1 }}>
            {comments.map((c, idx) => (
              <React.Fragment key={c._id}>
                {idx > 0 && <Divider />}
                <ListItem alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "stretch" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                        {c.author?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="medium">
                          {c.author}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {c.time}
                        </Typography>
                      }
                    />
                    {(c.userId === currentUser?.id || currentUser?.isAdmin) && (
                      <Box>
                        {editingId === c._id ? (
                          <>
                            <IconButton onClick={() => handleUpdateComment(c._id)} color="success">
                              <Save fontSize="small" />
                            </IconButton>
                            <IconButton onClick={cancelEditing} color="error">
                              <Close fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => startEditing(c)} color="primary">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteComment(c._id)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>

                  {editingId === c._id ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                      {c.text}
                    </Typography>
                  )}
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogCard;

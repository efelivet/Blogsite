import React, { useState, useEffect } from "react";
import { API } from "./api"; // Adjust as needed
import {
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
  Typography,
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

const BlogInteractions = ({ post, currentUser }) => {
  // Like logic (copied from BlogCard)
  const [liked, setLiked] = useState(post.likes.includes(currentUser?.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please login to like this post.");
      return;
    }

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(wasLiked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await API.post(`/api/blog/${post._id}/like`);
      setLikeCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      setLiked(wasLiked);
      setLikeCount(wasLiked ? likeCount + 1 : likeCount - 1);
    }
  };

  // Share logic (copied from BlogCard)
  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${post._id}`; // Updated path for detail page
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

  // Comment logic (copied from BlogCard)
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/api/blog/${post._id}/comment`);
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
      const res = await API.post(`/api/blog/${post._id}/comment`, { text });
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/api/blog/${post._id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

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
      const res = await API.put(`/api/blog/${post._id}/comment/${commentId}`, {
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
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          pt: 1,
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
              {post.shares || 0} {/* Assuming shares is tracked */}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={showCommentBox}>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
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

      {comments.length > 0 && (
        <List sx={{ mt: 2 }}>
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
    </>
  );
};

export default BlogInteractions;
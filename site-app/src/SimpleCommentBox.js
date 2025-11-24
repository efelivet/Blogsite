 import React, { useState } from "react";
import { Box, IconButton, TextField, Button, Typography } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

 export default function SimpleCommentBox() {
  const [showField, setShowField] = useState(false);
  const [comment, setComment] = useState("");
  const [submittedComment, setSubmittedComment] = useState("");

  const handleSend = () => {
    if (comment.trim() !== "") {
      setSubmittedComment(comment);
      setComment("");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <IconButton onClick={() => setShowField(true)}>
        <CommentIcon />
      </IconButton>

      {showField && (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1 }}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      )}

      {submittedComment && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {submittedComment}
        </Typography>
      )}
    </Box>
  );
}

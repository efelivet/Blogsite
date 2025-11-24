import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { lists } from "./articleList";

export default function NewsArticle() {
  return (
    <Grid container spacing={2}>
      {lists.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.title}>
          <Box sx={{ maxWidth:"1000px", margin:"auto" }}>
            <img src={item.img} alt="" style={{ width:"100%", objectFit:"crop",
              height:"300px",  }} />
          </Box>
          <Typography>{item.desc}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}

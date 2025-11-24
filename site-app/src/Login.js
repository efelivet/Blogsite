 import React from 'react'

 import {Box, TextField, Typography,Container,Paper,Button, CircularProgress} from '@mui/material'
import {API} from "./api"
 import {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from './AuthContext';



 export default function Login(){

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [loading, setLoading] = useState(false);
   const {setUser} = useAuth();
   const navigate = useNavigate(); 

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // Start spinner

    try {
      const res = await API.post("/api/login", { username, password });

      setSuccess("Login successful!");

  
         const user = res.data.user;

           console.log(user);

      // Save user in AuthContext
      setUser(user);

      setTimeout(() => {
        if (user?.isAdmin) {
          navigate("/post");
        } else {
          navigate("/");
        }
      }, 500);

      
    
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

    return(

  <Container maxWidth ="sm" sx={{mt:10,display:"flex",
   justifyContent:"center",alignItems:"center",
  
  }}>
   <Paper elevation ={3} sx ={{p:2,borderRadius:3,
      backgroundColor:"rgba(255,255,255,0.95)",}}>
   <Typography sx={{textAlign:"center",m:2}}>
      Login to your Account
   </Typography>

   <Box   component="form"  onSubmit={handleSubmit} sx={{display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",}}>
      <TextField sx={{maxWidth:300,mb:3}} type ="username" 
       value={username}
       onChange={(e) => setUsername(e.target.value)}
      />
      <TextField  sx={{maxWidth:300}} type ="Password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
      />

       {error && (
            <Typography
              variant="body2"
              sx={{ color: "red", mt: 1, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}

           {success && (
            <Typography
              variant="body2"
              sx={{ color: "green", mt: 1, textAlign: "center" }}
            >
              {success}
            </Typography>
          )}

     <Button
  type="submit"
  variant="contained"
  fullWidth
  sx={{
    mt: 3,
    backgroundColor: "#1976d2",
    "&:hover": { backgroundColor: "#539ce6ff" },
    borderRadius: 2,
    py: 1.2,
    height: 42,
    position: "relative",
    textTransform: "none",
    fontWeight: 500,
  }}
  disabled={loading}
>
  {loading ? (
    <>
      {/* Background overlay (same color as button) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#1976d2",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={22}
          thickness={5}
          sx={{
            color: "#fff",
          }}
        />
      </Box>
    </>
  ) : (
    "Login"
  )}
</Button>

   </Box>
   <Typography variant='body2' align='center' sx={{mt:2}}>
    Don't have an account?{" "}
    <Link to="/register">Register</Link>
   </Typography>
  
   </Paper>

  </Container>
    )
 }
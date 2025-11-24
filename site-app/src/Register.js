  import React from 'react'
  import {API} from "./api";
  import {Box, TextField, Typography,Container,Paper,Button,CircularProgress} from '@mui/material'
  import {useState} from "react"
  import {Link} from "react-router-dom"
 
  export default function Register(){

  const [username,setUsername] = useState("");
  const [password, setPassword] =useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] =useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async(e)=>{
   e.preventDefault();
   setError("");
   setSuccess("");
   setLoading(true); // Start spinner

   if(password !== confirmPassword){
      alert("Passwords do not match!")
      return
   }
   const userData = {username,password};
   console.log("Register Data:", userData);
   try{
      const res = await API.post("/api/register",{username,password})
   
      console.log(res.data);
      setSuccess("Registration successful")
      setUsername("");
      setPassword("");
   }catch(err){
      console.error(err);

      setError(err.response?.data?.message || "Registration failed!")
      
   }finally {
    setLoading(false); // ✅ stop spinner always (success or fail)
  }
  }

     return(
   <Container maxWidth ="sm" sx={{mt:10,display:"flex",
    justifyContent:"center",alignItems:"center",
   
   }}>
    <Paper elevation ={3} sx ={{p:2,borderRadius:3,
       backgroundColor:"rgba(255,255,255,0.95)",}}>
    <Typography sx={{textAlign:"center",m:2}}>
      Signup
    </Typography>
 
    <Box component ="form" onSubmit ={handleSubmit} sx={{display:"flex",flexDirection:"column",alignItems:"center",
       justifyContent:"center",}}>
       <TextField sx={{maxWidth:300,mb:2}} type ="username"
       label="username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}/>

       <TextField  sx={{maxWidth:300,mb:2}} type ="Password"
       value={password}
       label ="password"
       onChange={(e)=>setPassword(e.target.value)} />

       <TextField  sx={{maxWidth:300}} type ="Password"
       value={confirmPassword}
       label ="confirm password"
       onChange={(e)=>setConfirmPassword(e.target.value)} />
       {error && (<Typography variant ="body2"
       sx={{color:"red",mt:1,textAlign:"center"}}>
         {error}
         </Typography>)}
         {success && (<Typography variant ="body2"
         sx={{color:"green",mt:1,textAlign:"center"}}>
         {success}
         </Typography>)}
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
    "SignUp"
  )}
</Button>


       <Typography variant ="body2">
         Already have an account?{" "}
         <Link to="/login" style={{color:"#2e7d32",textDecoration:"none"}}>
         Login
         </Link>
       </Typography>
     
    </Box>
    </Paper>
 
   </Container>
     )
  }
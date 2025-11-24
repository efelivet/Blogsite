 import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchIcon from '@mui/icons-material/Search'
import News from './News'
import Sport from './Sport'
import Tech from './Tech'
import Videos from './Videos'
import ControllableStates from './ControllableStates'
import {Link} from 'react-router-dom';
import {Box, Link as MuiLink } from "@mui/material";

export default function FullWidthMenu({ toggleTheme, mode }) {
  const theme =useTheme()
   const [show,setShow]=useState(false);
   const [menuOpen, setMenuOpen] = useState(false);

   const[activeSection,setActiveSection]= useState("NEWS")
  
    function handleClick(){
       setShow(!show)
    }
const handleMenuToggle = () => {
setMenuOpen(!menuOpen);
};

const items =[
  {name:"NEWS",component:<News/>},
  {name:"SPORT",component:<Sport/>},
  {name:"TECH",component:<Tech/>},
  {name:"VIDEOS",component:<Videos/>}]


return (
<Box sx={{ flexGrow: 1,width:"100%" }} >
<AppBar position="static" color="primary">
<Toolbar >



 

 <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
    <Typography variant="h6" component="div" sx={{ fontSize: { xs: 10, md: 16 } }}>
      Blog
    </Typography>
  </Box>



<Box sx={{ display: "flex", flexGrow: 1,
   justifyContent:"center", alignItems: "center"}}>
    {items.map((item) => (
      <Button
        key={item.name}
        sx={{ fontSize: { xs: 8, md: 16 },display:{xs:"none",md:"flex"} }}
        onClick={() => setActiveSection(item.name)}
        color="inherit"
      >
        {item.name}
      </Button>
    ))}

    <MuiLink
      component={Link}
      to="/register"
      sx={{
        fontSize:{xs:13,md:14},
        color: "white",
        marginRight:{xs:0.5,md:1},
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      Register
    </MuiLink>

    <MuiLink
      component={Link}
      to="/login"
      sx={{
       fontSize:{xs:13,md:14},
        color: "white",
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      Login
    </MuiLink>
  </Box>


 <Box sx={{ display: "flex", alignItems: "center", }}>
    <IconButton color="inherit" onClick={toggleTheme}>
      {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
    <IconButton edge="start" color="inherit" onClick={handleMenuToggle}>
      <MenuIcon />
    </IconButton>
    <IconButton color="inherit" onClick={handleClick}>
      <SearchIcon />
    </IconButton>
  </Box>

</Toolbar>
</AppBar>
{menuOpen ? (
<Box
sx={{
position:"fixed",
top:64,
left:0,
width: "100%",
backgroundColor: "background.paper",
color: "text.primary",
padding: 2,
display: "flex",
alignItems:"flex-start",
height:"calc(100vh - 64px)",
justifyContent:"space-evenly",
flexDirection:"column",
transition: "0.3s",

}}
>
<Button color="inherit" sx={{fontSize:"1rem"}}>Home</Button>
<Button color="inherit" sx={{fontSize:"1rem"}}>About</Button>
<Button color="inherit" sx={{fontSize:"1rem"}}>Services</Button>
<Button color="inherit" sx={{fontSize:"1rem"}}>Contact</Button>
</Box>
):(<Box sx={{
 position:"static", top:80,}}> 
   
   
   <Typography>{items.find((item)=>item.name === activeSection)?.component}</Typography>
  
 
  </Box>)}
  <Box sx={{
    position:"fixed",
    top:70,
    right:0,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    width:"100%",
   
  }}> 

    {show &&
     
  <Box sx={{

    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    width:"30vw",
    height:"35vh",
    bgcolor:theme.palette.customBg.hightlight,
   
    padding:"4px"}}>
      <Box style={{display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"200px",
        height:"30px",
      }}>
        <ControllableStates/>
    
   
      </Box>
     
  </Box>
 
 
  
    }

     </Box>
 
  
</Box>


);
}
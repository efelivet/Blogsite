 import React, { useState } from "react";
 import './App.css'
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import News from './News'
import Sport from './Sport'
import Tech from './Tech'
import Videos from './Videos'
import {Link} from 'react-router-dom';
import {Box} from "@mui/material";


export default function FullWidthMenu({ toggleTheme, mode }) {
 
 
   const [menuOpen, setMenuOpen] = useState(false);

   const[activeSection,setActiveSection]= useState("NEWS")
  
   
const handleMenuToggle = () => {
setMenuOpen(!menuOpen);
};

const items =[
  {name:"NEWS",component:<News/>},
  {name:"SPORT",component:<Sport/>},
  {name:"TECH",component:<Tech/>},
  {name:"VIDEOS",component:<Videos/>}]


return (
<Box  >
<AppBar position="static" color="primary ">
<Toolbar sx={{ display:"flex",justisfyContent:"space-evenly",flexWrap:"wrap"}} >



 

 <Box sx={{ display: "flex",flex:{xs:0,md:1}}}>
    <Typography variant="h6" component="div" sx={{ fontSize: { xs: "0.8rem", md:"1.5rem" },
    display:{xs:"none",md:"block"}, }}>
      Blog
    </Typography>
  </Box>



<Box sx={{ display: "flex",flex:1,justifyContent:{xs:"flex-start",md:"center"}}}>
    {items.map((item) => (
      <button
        key={item.name}
        onClick={() => setActiveSection(item.name)}
        color="inherit"
        className="button-nav"
      > 
        {item.name}
      </button>
    ))}

 
  </Box>


 <Box sx={{ display: "flex",flex:1,justifyContent:"flex-end",}}>
    <IconButton color="inherit" onClick={toggleTheme}>
      {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
    <IconButton edge="start" color="inherit" onClick={handleMenuToggle} sx={{marginLeft:{xs:1,md:2}}} >
      <MenuIcon />
    </IconButton>
   
  </Box>

</Toolbar>
</AppBar>
{menuOpen ? (
<Box
sx={{
position:"fixed",
top:64,
right:4,
backgroundColor: "background.paper",
color: "text.primary",
padding: 1,
display: "flex",

height:"calc(100vh - 64px)",

flexDirection:"column",
transition: "0.3s",

}}
>
<Button color="inherit" sx={{fontSize:"1rem"}}>
  <Link to="/register" style ={{textDecoration:"none"}}>Sign In</Link>
  </Button>
<Button color="inherit" sx={{fontSize:"1rem"}}>
  <Link to="/login" style ={{textDecoration:"none"}}>Login</Link>
  </Button>

</Box>
):(<Box sx={{
 position:"static", top:60,}}> 
   
   
  <Typography >{items.find((item)=>item.name === activeSection)?.component}</Typography>
  
 
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

  

     </Box>
 
  
</Box>


);
}

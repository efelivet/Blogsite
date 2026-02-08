
import React from "react";
 import './App.css'
import { AppBar, Toolbar, IconButton, Typography, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {NavLink ,Outlet} from 'react-router-dom';
import {Box} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

export default function NavbarMenu({ toggleTheme, mode }) {
 
 
  

 
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


   const handleClose = () => {
    setAnchorEl(null);
  };

const navItems = [
    { name: "NEWS",   path: "/"   },
    { name: "SPORT",  path: "/sport"  },
    { name: "TECH",   path: "/tech"   },
    { name: "VIDEOS", path: "/videos" },
  ];

return (
<Box  >
<AppBar position="static" color="primary ">
<Toolbar sx={{ display:"flex",justisfyContent:"space-evenly",flexWrap:"wrap"}} >

 <Box sx={{ display: "flex",flex:{xs:0,md:1}}}>
    <Typography variant="h6" component="div" sx={{ fontSize: { xs: "0.8rem", md:"1.5rem" },
    display:{xs:"none",md:"block"}, }}>
      XPLORER
    </Typography>
  </Box>



<Box sx={{ display: "flex",flex:1,justifyContent:{xs:"flex-start",md:"center"}}}>
   {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                style={{ textDecoration: "none" }}
                className="button-nav"
              >
                {item.name}
              </NavLink>
    ))}

 
  </Box>


 <Box sx={{ display: "flex",flex:1,justifyContent:"flex-end",}}>
    <IconButton color="inherit" onClick={toggleTheme}>
      {mode === "light" ? <Brightness4Icon sx={{size:{xs:"small",md:"large"}}}/> : <Brightness7Icon sx={{size:{xs:"small",md:"large"}}}/>}
    </IconButton>
  
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt:{xs:0.5,md:0.9},ml:{xs:1.8,md:2.9} }}
              >
                <MenuItem onClick={handleClose}><NavLink to ="/register" style={{textDecoration:"none"}}>Sign Up</NavLink></MenuItem>
                <MenuItem onClick={handleClose}><NavLink to ="/login" style={{textDecoration:"none"}}>Login</NavLink></MenuItem>
              </Menu>
            </div>
         
   
  </Box>

</Toolbar>
</AppBar>

  

   <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
 

</Box>


);
}


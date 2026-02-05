
import React, { useState, useRef, useEffect } from "react";
 import './App.css'
import { AppBar, Toolbar, IconButton, Typography, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {NavLink ,Outlet} from 'react-router-dom';
import {Box} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function FullWidthMenu({ toggleTheme, mode }) {
 
 
   const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

   
    document.addEventListener("mousedown", handleClickOutside);

  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  
   
const handleMenuToggle = () => {
setMenuOpen(!menuOpen);
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
      {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
    <IconButton edge="start" color="inherit" onClick={handleMenuToggle} sx={{marginLeft:{xs:1,md:2}}} >
      <MenuIcon />
    </IconButton>
   
  </Box>

</Toolbar>
</AppBar>
{menuOpen && (
  <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <Box  ref={menuRef}
          sx={{
           
            position: "fixed",
            top: 64,
            right: 2,
            bgcolor: "background.paper",
            color: "text.primary",
            p: 2,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 1200,
          }}
        >
          <NavLink to="/register" style={{ textDecoration: "none" }}>
            <Box sx={{ py: 1, px: 2 }}>Sign Up</Box>
          </NavLink>
          <NavLink to="/login" style={{ textDecoration: "none" }}>
            <Box sx={{ py: 1, px: 2 }}>Login</Box>
          </NavLink>
        </Box>
        </ClickAwayListener>
      )}

  

   <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
 

</Box>


);
}


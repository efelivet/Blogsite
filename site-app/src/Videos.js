   import React from 'react'
  import {Box} from '@mui/material';

  import BlogList from "./BlogList";

  export default function Videos(){
  
  
 
    
     return(
        <Box sx ={{display:"flex",justifyContent:"center",alignContent:"center"}}>
        
            <BlogList category ="videos"/>   
        </Box>
     )
  }
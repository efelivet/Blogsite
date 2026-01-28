   import React from 'react'
  import {Box} from '@mui/material';

  import BlogList from "./BlogList";

  export default function Tech(){
  
  
 
    
     return(
        <Box sx ={{display:"flex",justifyContent:"center",alignContent:"center"}}>
        
            <BlogList category ="tech"/>   
        </Box>
     )
  }
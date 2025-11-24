     import React from 'react'
   import  {Typography} from '@mui/material';
    import { IconButton,Button,Box} from '@mui/material';
   import FavoriteIcon from '@mui/icons-material/Favorite';
   import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
   import ShareIcon from '@mui/icons-material/Share'
   import { useState } from 'react';
import BlogList from './BlogList';
  
  
    export default function Videos(){
    
    
     const [liked, setLiked] = useState(false);
        const items =[{
         title:"Videos",
         img:"",
         desc:"50 arrested as new NSCDC commandant leads sanitation monitoring in Edo",
         content:"The environmetal Taskforce on saturday arrested no fewer than 50 persons in Benin for violating environmetal sanitation",
        }
           
        ]
  
      
       return(
          <Box>
           {items.map(item=>(
               <>
            <Typography variant="h4" sx={{fontWeight:50,fontSize:"bold"}}>
              {item.title}
             </Typography>
             <Box>
               <img src ={item.img} alt ="myphoto.jpg"/>
             </Box>
             <Typography variant="h5">
              {item.desc}
             </Typography>
             <Typography variant ="body1">
              {item.content}
             </Typography>
             <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
             <IconButton onClick ={()=>setLiked(!liked)}>
              {liked ? (<FavoriteIcon sx={{color:"red",transform:"scale(1.2)",
                 transition:"transform 0.2s ease",
              }}/>)
              : (<FavoriteBorderIcon/>)}
             </IconButton>
  
    
   <Button startIcon={<ShareIcon/>}>
    share
   </Button>
  </Box>
   </>
         
     ))}
          <BlogList category ="videos"/>
     </Box>
       )
    }
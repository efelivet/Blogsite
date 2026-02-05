import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import NavbarMenuTheme from './NavbarMenuTheme';
import Login from './Login'
import Register from './Register'
import Post from './Admin/Post';
import FetchBlogs from './Admin/FetchBlogs';
import SingleBlog from './Admin/SingleBlog'
import { useAuth } from "./AuthContext";
import BlogDetails from "./BlogDetails"
import News from "./News";
import Sport from "./Sport"
import Tech from "./Tech"
import Videos from "./Videos"

function App(){
  
 const {user} =useAuth();

   return (
   <>
    <BrowserRouter>
    
    <Routes>
      <Route element={<NavbarMenuTheme />}>
      <Route path ='/' element ={<News/>}/>
      <Route path ='/sport' element ={<Sport/>}/>
      <Route path ='/tech' element ={<Tech/>}/>
      <Route path ='/videos' element ={<Videos/>}/>
      <Route path ='/login' element ={<Login/>}/>
      <Route path ='/register' element ={<Register/>}/>
      <Route path ='/blog/:id' element ={<BlogDetails/>}/>
     
      {user?.isAdmin ?<Route path="/post" element={<Post />} />
      : <Route path ='/' element ={<News/>}/>}
       
       <Route path="/fetchAll" element={<FetchBlogs />} />
       <Route path="/fetchOne/blog/:id" element={<SingleBlog />} />
     
    </Route>
    </Routes>
    </BrowserRouter>
  
   </>
  
   
   

 );
}

export default App;

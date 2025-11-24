import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import LightDarkTheme from './LightDarkTheme';
import Login from './Login'
import Register from './Register'
import Post from './Post';
import FetchBlogs from './FetchBlogs';
import SingleBlog from './SingleBlog'
import NewsArticle from './NewsArticle'
import { useAuth } from "./AuthContext";
function App(){
  
 const {user} =useAuth();
   return (
   <>
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={ <LightDarkTheme/>}/>
      <Route path ='/login' element ={<Login/>}/>
      <Route path ='/register' element ={<Register/>}/>
      {user?.isAdmin && <Route path="/post" element={<Post />} />}
   
     
      <Route path="/fetchAll" element={<FetchBlogs />} />
       <Route path="/fetchOne/:id" element={<SingleBlog />} />
       <Route path="news" element={<NewsArticle />} />
  
    </Routes>
    </BrowserRouter>
  
   </>
  
   
   

 );
}

export default App;

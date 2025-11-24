 import axios from "axios";

 const API_ROOT = "http://localhost:5000";

//  Folder where Express serves images
const BLOG_IMG_PATH = "/Public/img/";

export const API = axios.create({
  baseURL:`${API_ROOT}`, // base route for auth
  withCredentials: true,
});


//  Helper to get the full URL of a blog image
export const getBlogImage = (filename) => `${API_ROOT}${BLOG_IMG_PATH}${filename}`;



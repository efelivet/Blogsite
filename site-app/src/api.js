 import axios from "axios";

 const API_ROOT = "https://blogsite-7aer.onrender.com";

const BLOG_IMG_PATH = "/Public/img/";

export const API = axios.create({
  baseURL:`${API_ROOT}`, 
  withCredentials: true,
});



export const getBlogImage = (filename) => `${API_ROOT}${BLOG_IMG_PATH}${filename}`;



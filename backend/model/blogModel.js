 // model/blogModel.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    img: { type: String }, // URL or Cloudinary link
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
    shares: { type: Number, default: 0 },
    comments: [commentSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categories:{
      type:[String],
      enum:["news","sport","tech","videos"],
      default:[]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
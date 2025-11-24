 // routes/blogRouter.js
const express = require("express");
const Blog = require("../model/blogModel");
const multer = require('multer')
const path = require('path')
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../verifyToken");

const router = express.Router();

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'Public/img')
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload =multer({
  storage
})

// POST: Create Blog (Admin OR Authenticated User)
router.post("/blogs",verifyToken,upload.single('img'), async (req, res) => {
  try {
      // Split and clean categories
      const categories = req.body.categories
        ? req.body.categories
            .split(",")
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c)
        : [];

    const { title, description } = req.body;
  
    const newBlog = new Blog({
      title,
      description,
      categories,
      img:req.file.filename,
      author:req.user.id, // from JWT
      // from JWT
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// routes/blogRouter.js
router.get("/fetchAll", async (req, res) => {
  try {
    const { 
      category,      // single: ?category=tech
      categories,    // multiple: ?categories=tech,sport
      q,             // search: ?q=AI
      page = 1, 
      limit = 10,
      sort = "-createdAt" // default: newest first
    } = req.query;

    // Build query
    const query = {};

    // 1. Filter by single category
    if (category) {
      query.categories = category;
    }

    // 2. Filter by multiple categories (AND logic)
    if (categories) {
      const cats = categories.split(",").map(c => c.trim());
      query.categories = { $all: cats }; // must have ALL
      // Use $in for OR logic: { $in: cats }
    }

    // 3. Search in title & description
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    // 4. Pagination
    const skip = (page - 1) * limit;
    const total = await Blog.countDocuments(query);

    // 5. Fetch blogs
    const blogs = await Blog.find(query)
      .populate("author", "username")
      .populate("comments.userId", "username")
      .sort(sort)           // e.g., "-createdAt", "likes.length"
      .skip(skip)
      .limit(parseInt(limit));

    // 6. Add likes count
    const blogsWithLikes = blogs.map(blog => ({
      ...blog._doc,
      likesCount: blog.likes.length,
    }));

    res.json({
      blogs: blogsWithLikes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Single Blog by ID (Public)
router.get("/fetchOne/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.userId", "username");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Update Blog (Only Author OR Admin)
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only author or admin can update
    if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only update your own blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: Delete Blog (Only Author OR Admin)
router.delete("/delete/:id",verifyToken, async (req, res) => {
try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    console.log("User from token:", req.user);
    console.log("Blog author:", blog.author.toString());

    const userId = req.user.id || req.user._id; // ✅ safe fallback

    if (blog.author.toString() !== userId || !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only delete your own blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// POST: Like a Blog
router.post("/:id/like", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;

    if (blog.likes.includes(userId)) {
      // Unlike
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ likes: blog.likes.length, liked: blog.likes.includes(userId) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// POST: Comment on Blog
router.post("/:id/comment", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Push comment
    blog.comments.push({
      userId: req.user.id,
      text: text.trim(),
    });

    // Save changes
    await blog.save();

    // Fetch the latest comment with user populated
    const updatedBlog = await Blog.findById(req.params.id)
      .populate("comments.userId", "username")
      .select("comments");

    // Get the newly added comment (last in the array)
    const newComment = updatedBlog.comments[updatedBlog.comments.length - 1];

    res.status(200).json({
      _id: newComment._id,
      author: newComment.userId.username,
      text: newComment.text,
    });
  } catch (err) {
    console.error("❌ Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST: Share Blog (increment share count)
router.post("/:id/share", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({ shares: blog.shares });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all comments for a post
router.get("/:id/comment", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate("comments.userId", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:id/comment/:commentId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Updated text required" });

    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author or admin can update
    if (comment.userId !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized to edit this comment" });

    comment.text = text;
    

    await post.save();
    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE: Remove a comment
router.delete("/:id/comment/:commentId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // ✅ Allow author OR admin
    if (comment.userId !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized to delete this comment" });

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
import express from 'express';
import multer from 'multer';
import { createBlog, getBlogs, getBlogById, getUserBlogs, deleteBlog, updateBlog } from '../controllers/blogController.js';
import { authMiddleware } from '../middleware/auth.js';
const blogRouter = express.Router();
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({storage: storage});

blogRouter.post('/create', upload.single("image"), authMiddleware, createBlog);
blogRouter.get('/', getBlogs);
blogRouter.get('/:id', getBlogById);
blogRouter.get('/user/blogs',authMiddleware, getUserBlogs);
blogRouter.delete('/:id', authMiddleware, deleteBlog);
blogRouter.post('/:id', authMiddleware, upload.single("image"), updateBlog);

export default blogRouter;
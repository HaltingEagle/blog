import express from 'express';
import multer from 'multer';
import { createComment, getComments, getCommentsByBlog, deleteComment, deleteCommentsByBlog } from '../controllers/commentControlelr.js';
import { authMiddleware } from '../middleware/auth.js';
const commentRouter = express.Router();
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({storage: storage});

commentRouter.post('/create/:id', authMiddleware, upload.single("image"), createComment);
commentRouter.get('/:id', getCommentsByBlog);
commentRouter.get('/', getComments);
commentRouter.delete('/:id', authMiddleware, deleteComment);
commentRouter.delete('/blog/:id', authMiddleware, deleteCommentsByBlog);

export default commentRouter;


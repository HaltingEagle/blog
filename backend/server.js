import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

import { connectDB } from './config/db.js';
connectDB();

import userRouter from './routes/userRoute.js';
app.use('/api/user', userRouter);

app.use('/images', express.static('uploads'));

import blogRouter from './routes/blogRoute.js';
app.use('/api/blog', blogRouter);

import commentRouter from './routes/commentRoute.js';
app.use('/api/comment', commentRouter);

app.get('/', (_, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
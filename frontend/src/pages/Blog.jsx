import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { BlogContext } from '../context/BlogContext';
import axios from 'axios';
import moment from 'moment';
import add from "../assets/add_icon.png"
import added from "../assets/add_icon_green.png"
import { toast } from 'react-toastify';

const Blog = () => {
    const { id } = useParams();
    const { url, token, getUser } = useContext(BlogContext);
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState("");
    const [image, setImage] = useState(false);
    const [text, setText] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (image) formData.append("image", image);
        formData.append("text", text);

        try {
            const res = await axios.post(`${url}/comment/create/${id}`, formData, { headers: { token } });
            if (res.status !== 201) {
                toast.error("Failed to add comment.");
                setImage(false);
                setText("");
                return;
            }
            fetchComments();
            setImage(false);
            setText("");
            toast.success("Comment added successfully.");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${url}/comment/${id}`);
            const commentsWithUsernames = await Promise.all(
                res.data.map(async (comment) => {
                    const commentUsername = await getUser(comment.userId);
                    return { ...comment, username: commentUsername };
                })
            );
            setComments(commentsWithUsernames);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${url}/blog/${id}`);
                setBlog(res.data.blog);
                setUsername(await getUser(res.data.blog.userId));
            } catch (error) {
                console.log(error);
            }
        };

        fetchBlog();
        fetchComments();
    }, [id, getUser, url]);

    if (!blog) return <p>Blog not found.</p>;

    return (
        <div className='w-[90%] mx-auto'>
            <div className="p-4">
                <h1 className="text-3xl font-bold max-lg:text-center">{blog.title}</h1>
                <p className="text-sm text-gray-400 max-lg:text-center">{blog.category}</p>
                <img
                    src={`http://localhost:4000/images/${blog.image}`}
                    alt={blog.title}
                    className="object-cover w-full h-64 my-4 rounded-xl"
                />
                <p className="mt-4 text-sm text-gray-400 max-lg:text-center">Published on {moment(blog.timestamp).format('Do MMMM YYYY')}</p>
                <p className="text-sm text-gray-400 max-lg:text-center">By <span className="font-semibold text-gray-600">{username}</span></p>
                <p className="my-3 text-gray-600 break-words whitespace-pre-wrap max-lg:text-center">{blog.content}</p>
            </div>
            <hr />
            <div className="">
                {token && (
                    <div className="flex flex-col p-4">
                        <h2 className="my-2 text-2xl font-semibold max-lg:text-center">Add Comment</h2>
                        <form onSubmit={onSubmitHandler}>
                            <textarea
                                value={text}
                                onChange={e => setText(e.target.value)}
                                className="w-full p-2 border rounded-lg max-lg:mx-auto"
                                placeholder="Write your comment..."
                                name="text"
                                required
                            />
                            <label htmlFor="image">
                                <img src={image ? added : add} className='py-2 cursor-pointer max-lg:mx-auto hover:scale-110' alt="upload image area" />
                            </label>
                            <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
                            <button type="submit" className="flex px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 max-lg:mx-auto max-lg:items-center">
                                Submit
                            </button>
                        </form>
                    </div>
                )}
                <div className="p-4">
                    <hr />
                    <h2 className="my-4 text-2xl font-semibold max-lg:text-center">Comments</h2>
                    {comments.length === 0 ? (
                        <p className="text-gray-500 max-lg:text-center">No comments yet.</p>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index} className="p-4 mt-2 border rounded-lg">
                                <p className="font-semibold">{comment.username}</p>
                                <p className="text-sm text-gray-600">{moment(comment.timestamp).fromNow()}</p>
                                <div className="flex flex-col gap-2 mt-2">
                                    {comment.image && (
                                        <img src={`http://localhost:4000/images/${comment.image}`} className="lg:w-[200px] lg:h-[200px]" alt="" />
                                    )}
                                    <p className="mt-2 text-gray-800 break-words whitespace-pre-wrap">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;

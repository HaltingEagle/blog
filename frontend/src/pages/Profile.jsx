import React, { useState, useEffect, useContext } from 'react'
import { BlogContext } from '../context/BlogContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { url, token, setToken } = useContext(BlogContext)
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [passwordChange, setPasswordChange] = useState({
        oldPassword: "",
        newPassword: ""
    })
    const [editingBlogs, setEditingBlogs] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        category: "",
        content: "",
        id: ""
    });
    const [image, setImage] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordChange({ ...passwordChange, [name]: value })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    }

    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/user/change-password`, passwordChange, { headers: { token } });
            if (res.status === 200) {
                toast.success(res.data.message);
                setIsResetPassword(false);
                setPasswordChange({oldPassword: "", newPassword: "" })
                setToken("");
                localStorage.removeItem("token");
                navigate("/");
            }
            else {
                toast.error(res.data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    }

    const editBlog = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", editData.title);
        formData.append("category", editData.category);
        formData.append("content", editData.content);
        if (image !== false) {
            formData.append("image", image);
        }
        try {
            const res = await axios.post(`${url}/blog/${editData.id}`, formData, { headers: { token } });
            if (res.status === 200) {
                toast.success(res.data.message);
                setEditingBlogs(null);
                setEditData({ title: "", category: "", content: "" });
                setImage(false);
                fetchBlogs();
            } else {
                toast.error(res.data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    const removeBlog = async (id) => {
        try {
            const commentRes = await axios.delete(`${url}/comment/blog/${id}`, { headers: { token } });
            if (commentRes.status === 200) {
                const blogRes = await axios.delete(`${url}/blog/${id}`, { headers: { token } });
                if (blogRes.status === 200) {
                    toast.success(blogRes.data.message);
                    fetchBlogs();
                }
                else{
                    toast.error(blogRes.data.error || "Something went wrong");
                }
            }
            else {
                toast.error(commentRes.data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    }

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${url}/blog/user/blogs`, { headers: { token } });
            if (res.status === 200) {
                console.log(res.data);
                setBlogs(res.data);
            }
            else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlogs();
        if(localStorage.getItem("token") === null){
            navigate("/")
        }
    }, [token])
    return (
        <div className="w-[90%] mx-auto flex flex-col gap-[20px]">
            <div className="flex p-3">
                <button
                    className="p-3 rounded-full bg-slate-400 hover:bg-slate-300 max-md:w-full"
                    onClick={() => setIsResetPassword(true)}
                >
                    Reset Password
                </button>
            </div>
            <div className="flex flex-col gap-[10px]">
                <p className='text-[20px] max-md:text-center max-md:font-bold'>Blogs List</p>
                <div className="">
                    <div className="hidden md:grid grid-cols-[0.5fr_1fr_1fr_2fr_0.5fr] max-md:grid-cols-[0.5fr_1fr_1fr_3fr_0.5fr] items-center text-[13px] border border-gray-400 px-[12px] py-[15px] gap-[10px] title text-center">
                        <b>Image</b><b>Title</b><b>Category</b><b>Content</b><b>Action</b>
                    </div>
                    {blogs.map((blog, index) => (
                        <div className="grid grid-cols-[0.5fr_1fr_1fr_2fr_0.5fr] max-md:flex-col max-md:flex max-md:gap-[10px] items-center text-[13px] border border-gray-400 px-[12px] py-[15px] gap-[10px] max-md:my-2 overflow-auto" key={index}>
                            <img src={'http://localhost:4000/images/' + blog.image} className="w-full h-[50px] max-md:w-[200px] max-md:h-[100px] object-cover" alt=""/>
                            <p className="max-md:text-[20px] break-words whitespace-pre-wrap text-center">{blog.title}</p>
                            <p className='max-md:text-[15px] bg-slate-400 rounded-full p-2 lg:w-[13rem] text-center'>{blog.category}</p>
                            <p className='max-md:text-[20px] max-md:border max-md:p-3 w-full break-words whitespace-pre-wrap'>{blog.content}</p>
                            <div className="flex gap-2 max-md:flex-col md:p-3">
                                <p className="text-lg cursor-pointer hover:bg-blue-500 hover:text-white max-md:bg-blue-500 max-md:border max-md:p-3 max-md:rounded-lg" onClick={() => {
                                        setEditingBlogs(true);
                                        setEditData({
                                            id: blog._id,
                                            title: blog.title,
                                            category: blog.category,
                                            content: blog.content,
                                        });
                                    }}
                                >
                                    Edit
                                </p>
                                <p className="text-lg cursor-pointer md:ml-2 hover:bg-red-500 hover:text-white max-md:bg-red-500 max-md:border max-md:p-3 max-md:rounded-lg max-md:text-center" onClick={() => removeBlog(blog._id)}>
                                    X
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isResetPassword && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 z-110 bg-slate-900">
                    <form onSubmit={resetPassword} className="p-4 bg-white rounded-lg">
                        <h2 className="mb-2 text-xl font-semibold">Reset Password</h2>
                        <input type="password" name="oldPassword" value={passwordChange.oldPassword} placeholder="Old Password" onChange={handlePasswordChange} className="block w-full p-2 my-2 border rounded" required/>
                        <input type="password" name="newPassword" value={passwordChange.newPassword} placeholder="New Password" onChange={handlePasswordChange} className="block w-full p-2 my-2 border rounded" required/>
                        <div className="flex justify-end gap-2">
                            <button type="button" className="px-4 py-2 bg-gray-400 rounded" onClick={() => setIsResetPassword(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {editingBlogs && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 z-110 bg-slate-900">
                    <form onSubmit={editBlog} className="p-4 bg-white rounded-lg">
                        <h2 className="mb-2 text-xl font-semibold max-md:text-center">Edit Blog</h2>
                        <input type="text" name="title" value={editData.title} placeholder="Title" onChange={handleEditChange} className="block w-full p-2 my-2 border rounded"/>

                        <select type="text" name="category" value={editData.category} placeholder="Category" onChange={handleEditChange} className="block w-full p-2 my-2 border rounded hover:scale-105">
                            <option value="Technology and Innovation">Technology and Innovation</option>
                            <option value="Health and Wellness">Health and Wellness</option>
                        <option value="Lifestyle and Personal Development">Lifestyle and Personal Development</option>
                        </select>

                        <textarea name="content" value={editData.content} placeholder="Content" rows={9} onChange={handleEditChange} className="block w-full p-2 my-2 border rounded"/>

                        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} className="my-2"/>
                        <div className="flex justify-end gap-2 max-md:items-center max-md:justify-center">
                            <button type="button" className="px-4 py-2 bg-gray-400 rounded hover:scale-110" onClick={() => setEditingBlogs(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:scale-110">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile
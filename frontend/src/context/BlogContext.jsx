import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const BlogContext = createContext(null);

const BlogContextProvider = ( props ) => {
    const [blogs, setBlogs] = useState([]);
    const [token, setToken] = useState("");
    const [comments, setComments] = useState([]);
    const url = "http://localhost:4000/api";


    const getBlogs = async () => {
        try {
            const res = await axios.get(`${url}/blog/`);
            setBlogs(res.data);
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getUser = async (id) => {
        try {
            const res = await axios.get(`${url}/user/${id}`);
            return res.data.username
        }catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
        getBlogs();
    },[])

    const contextValue = {
        blogs,
        setBlogs,
        token,
        getBlogs,
        setToken,
        comments,
        setComments,
        url,
        getUser,
    }

    return (
        <BlogContext.Provider value={contextValue}>
            {props.children}
        </BlogContext.Provider>
    )
}

export default BlogContextProvider
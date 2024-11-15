import React, {useState, useEffect, useContext} from 'react'
import { BlogContext } from '../context/BlogContext'
import BlogItem from './BlogItem'
import { useLocation } from 'react-router-dom'
const BlogDisplay = ({category}) => {
    const {blogs, getBlogs} = useContext(BlogContext)
    const location = useLocation()

    useEffect(() => {
        getBlogs()
    }, [location])
    return (
        <div className='grid grid-cols-1 gap-5 m-4 mx-12 md:grid-cols-2 lg:grid-cols-4'>
            {blogs.map((blog, index) => {
                if(!category || category === "All" || blog.category === category){
                    return <BlogItem key={index} id={blog._id} userId={blog.userId} title={blog.title} image={blog.image} category={blog.category} timestamp={blog.timestamp} />
                }
            })}
        </div>
    )
}

export default BlogDisplay
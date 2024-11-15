import React, {useContext, useEffect, useState} from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { BlogContext } from '../context/BlogContext'
const BlogItem = ({id,userId, title, image, category, timestamp}) => {
    const {getUser} = useContext(BlogContext)
    const [username, setUsername] = useState("")

    useEffect(() => {
        const fetchUsername = async () => {
            const name = await getUser(userId);
            setUsername(name);
        };
        fetchUsername();
    }, [getUser]);
    
    return (
        <Link to={`/blog/${id}`} className='w-full p-4 no-underline border rounded-xl border- hover:shadow-lg'>
            <div className="w-full h-48">
                <img src={"http://localhost:4000/images/" + image} className="object-cover w-full h-full rounded-xl" alt="" />
            </div>
            <div className="flex flex-col">
                <p className='mt-2 text-xl font-semibold'>{title}</p>
                <p className='px-2 py-1 bg-gray-400 rounded-full text-[12px]  my-2 inline-block'>{category}</p>
                <p className='text-sm'>By <span className='font-semibold'>{username}</span></p>
                <p className='text-sm text-gray-400'>{moment(timestamp).fromNow()}</p>
            </div>
        </Link>
    )
}

export default BlogItem
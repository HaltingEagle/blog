import React, { useState , useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { BlogContext } from '../context/BlogContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import defaultImage from "../assets/upload_area.png"
const AddBlog = () => {
    const {token, url} = useContext(BlogContext)
    const navigate = useNavigate()
    const [image,setImage] = useState(false)
    const [data, setData] = useState({
        title:"", category:"Technology and Innovation", content:""
    })

    const onChangeHandler = async (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        if(image !== false){
            formData.append("image", image)
        }
        formData.append("title", data.title)
        formData.append("category", data.category)
        formData.append("content", data.content)
        try {
            const res = await axios.post(`${url}/blog/create`,formData, {headers:{token}} );
            if (res.status === 201) {
                setData({ title: "", category: "Technology and Innovation", content: "" })
                setImage(false)
                toast.success("Added Blog Successfully");
            }
            else {
                toast.error("Failed to Add Blog");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    }
    useEffect(() => {
        if (!token) {
            navigate("/")
        }
    },[])
    return (
        <div className='w-[90%] px-8 py-4 max-lg:mx-auto max-md:justify-center max-md:items-center max-md:text-center'>
            <p className='py-3 text-4xl font-bold max:lg:text-2xl max-lg:text-center'>Add Blog</p>
            <hr className='w-full'/>
            <form className='flex flex-col gap-4' onSubmit={onSubmitHandler}>
                <div className="flex flex-col gap-2 pt-2">
                    <p className='font-semibold lg:text-3xl max-lg:text-xl'>Upload Image</p>
                    <label htmlFor="image">
                    <img src={image? URL.createObjectURL(image) : defaultImage} className='max-lg:w-[14rem] max-md:items-center max-md:mx-auto lg:w-[300px]' alt="upload image area" />
                    </label>
                    <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden/>
                </div>
                <div className="flex flex-col gap-4">
                    <p className='font-semibold lg:text-3xl max-lg:text-xl'>Blog Title</p>
                    <input type="text" onChange={onChangeHandler} value={data.title} name='title' placeholder='Type your blog title here' className='p-1 bg-gray-200 rounded-md max-lg:w-[14rem] lg:w-[600px] max-md:mx-auto' required />
                </div>
                <div className="flex flex-col gap-4">
                    <p className='font-semibold lg:text-3xl max-lg:text-xl'>Blog Category</p>
                    <select onChange={onChangeHandler} name="category" className='lg:w-[300px] max-lg:w-[14rem] p-1 max-md:mx-auto hover:scale-105 rounded-lg' required >
                        <option value="Technology and Innovation">Technology and Innovation</option>
                        <option value="Health and Wellness">Health and Wellness</option>
                        <option value="Lifestyle and Personal Development">Lifestyle and Personal Development</option>
                    </select>
                </div>
                <div className="flex flex-col gap-4">
                    <p className='font-semibold lg:text-3xl max-lg:text-xl'>Blog Content</p>
                    <textarea onChange={onChangeHandler} value={data.content} name='content' placeholder='Type your blog content here' className='bg-gray-200 lg:w-[600px] p-1 rounded-md' rows={6} required />
                </div>
                <button type='submit' className='p-2 max-lg:w-[100px] max-lg:mx-auto rounded-full bg-slate-500 hover:bg-slate-400 lg:w-20'>Submit</button>
            </form>
        </div>
    )
}

export default AddBlog
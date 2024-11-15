import React, {useState, useEffect} from 'react'
import BlogDisplay from '../components/BlogDisplay'
import CategoryFilter from '../components/CategoryFilter'
const Home = () => {
    const [category, setCategory] = useState("")
    return (
        <div>
            <CategoryFilter category={category} setCategory={setCategory}/>
            <BlogDisplay category={category}/>
        </div>
    )
}

export default Home
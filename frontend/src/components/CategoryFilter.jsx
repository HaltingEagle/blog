import React, { useState } from 'react';

const CategoryFilter = ({ category, setCategory }) => {
    const [categories] = useState(["Technology and Innovation", "Health and Wellness", "Lifestyle and Personal Development"]);

    return (
        <div className='flex flex-wrap gap-4 p-4 mx-auto'>
            {categories.map((item, index) => (
                <div onClick={() => setCategory(prev => prev === item ? "All" : item)} key={index} className='p-2 mx-auto text-center cursor-pointer bg-slate-400 rounded-xl'>
                    <p className={category === item ? "font-bold" : ""}>{item}</p>
                </div>
            ))}
        </div>
    );
};

export default CategoryFilter;

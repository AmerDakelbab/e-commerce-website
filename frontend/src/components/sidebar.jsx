import React, { useEffect, useState } from 'react'
import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function Sidebar({ isVisible, setIsVisible }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/categories`)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [])


    return (
        isVisible && (
            <div className="flex flex-col  fixed top-0 left-0 h-full sm:w-32 xs: w-32 md: w-64 lg:w-64 xl:w-64 2xl:w-64  bg-gray-800 text-white z-50 transition-all duration-300 ">
                <div className='border-b border-white '>
                    <MenuOutlined onClick={() => setIsVisible(false)} className="text-white text-2xl p-5 cursor-pointer" />
                </div>
                <Link to='/'>
                    <Button type='text' className='p-2 text-gray-400 w-fit mt-5 w-full border-b-white' >Main Menu</Button>
                </Link>
                {categories.map((category, index) => (
                    <div key={index} className='p-2 border-b border-white '>
                        <Link to={`/categories/${category.category_name.toLowerCase()}`}>
                            <Button type='text' className='p-5 text-white' >{category.category_name}</Button>
                        </Link>
                    </div>
                ))}
            </div>
        )
    );
}

export default Sidebar;
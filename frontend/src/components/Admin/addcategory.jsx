import { Button, Input, message, Select } from 'antd';
import React, { useState } from 'react'
import axios from 'axios';

function Addcategory() {

    const [categoryData, setcategoryData] = useState({
        category_name: '',
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/admin/addcategory", categoryData, {
                headers: {
                    "Content-Type": 'application/json',
                },
            });
            message.success("Category added Successfull!");
            setcategoryData({ category_name: '' });
        } catch (err) {
            console.error("Error occurred:", err);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setcategoryData({
            ...categoryData,
            [name]: value
        });
    }


    return (
        <div className='mt-64 ml-40'>
            <p className='font-bold text-3xl mb-5'>Add Category</p>
            <form onSubmit={handleSubmit}>
                <Input className='my-2' placeholder='name' value={categoryData.category_name} name='category_name' onChange={handleInput} />
                <Button type='primary' className='my-2 w-32' htmlType='submit'>Submit</Button>
            </form>
        </div>
    )
}

export default Addcategory;
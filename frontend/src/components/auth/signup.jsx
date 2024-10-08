import { Button, Input, message } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup() {

    const [formData,setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const navigate = useNavigate();


    const handleInput  = (e) => {
        const { name,value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_BACKEND_URL}/signup`, formData);
            if (response.status === 200) {
                message.success("Signup successful!"); 
                console.log("Signup FormData Sent!");
                navigate('/login');
            }
        } catch (err) {
            
            if (err.response && err.response.data && err.response.data.message) {
                message.error(err.response.data.message); 
            } else {
                message.error("An unexpected error occurred."); 
            }
            console.log("Error:", err);
        }
    };

    return (
        <div className='flex flex-col items-center mt-72 mx-5'>
            <p className='text-4xl font-bold mb-5'>Signup</p>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <Input className='h-10 mb-3' placeholder='type..' type='email' value={formData.email} name='email' onChange={handleInput} required />
                <label>Username</label>
                <Input className='h-10 mb-3' placeholder='type..' type='text' value={formData.username} name='username' onChange={handleInput} required />
                <label>Password</label>
                <Input className='h-10 mb-5' placeholder='type..' type='password' value={formData.password} name='password' onChange={handleInput} required />
                
                <div className='flex justify-center'>
                    <Button className='w-48 h-10' htmlType='submit' type='primary'>Signup</Button>
                </div>
            </form>
        </div>
    );
}

export default Signup
import { Button, Input, message } from 'antd'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {

    const [formData,setFormData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const toggleInput = (e) => {
            const {name,value} = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/login', formData);
            console.log("RESPONSE",response);

            if (response.status === 200) {
                message.success("Logined Successfully!");
                const token = response.data.token;
                
                if (!token) {
                    console.error("Token is undefiend!");
                    return;
                }
                localStorage.setItem('token',token);
                localStorage.setItem('hasLoggedIn', 'true'); // Set login flag

                const decodedToken = jwtDecode(token);
                const userRole = decodedToken.userRole;

                if (userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            // Display appropriate error messages
            if (err.response && err.response.data && err.response.data.message) {
                message.error(err.response.data.message); // Show error message from server
            } else {
                message.error("An unexpected error occurred."); // Fallback error message
            }
            console.log("Error:", err);
        }
    };
 
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <p className='text-4xl font-bold mb-5'>Login</p>
            <form onSubmit={handleSubmit} className="w-96">
                <div className='flex flex-col'>
                    <label>Username</label>
                    <Input className='h-10 mb-3' size='default' type='username' name='username' placeholder='Type..' value={formData.username} onChange={toggleInput} required />
                    <label>Password</label>
                    <Input className='h-10 mb-5' type='password' placeholder='Type..' name='password' value={formData.password} onChange={toggleInput} required />
                    <div className="flex justify-center">
                        <Button className='w-48 h-10' htmlType='submit' type='primary'>Login</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}


export default Login;
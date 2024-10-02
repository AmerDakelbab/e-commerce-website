import { Button } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';

function Checkout({isVisible}) {
  return (
    <div className='flex justify-center'>
    <div className={` w-screen h-screen flex flex-col justify-center items-center bg-gray-200 transition-all duration-300 ${isVisible ? 'ml-auto' : 'ml-0'} `}>
        <p className='text-3xl font-bold text-red-800'>CHECKOUT COMING SOON</p>
        <p className='text-3xl font-bold text-red-800'>...</p>

        <Link to='/'><Button className='text-3xl mt-12 border-b-blue-600' type='link'>GO BACK</Button></Link>
    </div>
    </div>
  );
}

export default Checkout;
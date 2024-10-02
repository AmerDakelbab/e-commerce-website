import { Button, message } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Adminsidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        message.success("Logout Successfully!");
        navigate('/login');
        window.location.reload();
      };
  return (
    <div className='bg-gray-800 w-fit fixed left-0 top-0 bottom-0 flex flex-col '>
      <div className='mt-40 md:mt-0 lg:md-0 xl:mt-0 2xl:mt-0'>
          <div>
            <p className='text-white text-3xl m-5 '>LOGO</p>
          </div>
          <div className='mx-3'>
            <p className='text-gray-300 text-sm font-bold '>PRODUCTS</p>
            <hr className='w-32 mb-3 mt-1  border-gray-500'/>
            <div className='flex flex-col'>
            <Link className='mb-3' to='/admin/addproducts'><Button type='link' className=' text-white border-b-2 w-28 border-gray-500'>Add Products</Button></Link>
            <Link to='/admin'><Button type='link' className=' text-white border-b-2 mb-3 border-gray-500 w-28'>View Products</Button></Link>
            </div>
          </div>
          <div className='mx-3'>
            <p className='text-gray-300 font-bold text-sm '>CATEGORIES</p>
            <hr className='w-32 mb-3  border-gray-500'/>
            <div className='flex flex-col'>
            <Link className='mb-3' to='/admin/addcategory'><Button type='link' className=' w-28 text-white border-b-2 border-gray-500'>Add category</Button></Link>
            <Link to='/admin/viewcategories'><Button type='link' className=' text-white w-28 border-b-2 border-gray-500 mb-3'>View Categories</Button></Link>
            </div>
          </div>
          <div className='mx-3'>
            <p className='text-gray-300 font-bold text-sm '>USERS</p>
            <hr className='w-32  mb-3 border-gray-500'/>
            <div className='flex flex-col'>
            <Link className='mb-3' to='/admin/viewusers'><Button type='link' className=' w-28 text-white border-b-2 border-gray-500'>View Users</Button></Link>
            <Link className='mb-3' to='/admin/viewadmins'><Button type='link' className='  w-28 text-white border-b-2 border-gray-500'>View Admins</Button></Link>
          </div>
          </div>
            
            <hr className='w-32 my-2 border-gray-500'/>
            <Button className='w-24 m-5 bg-red-500'  type='primary' onClick={handleLogout}>Logout</Button>
        </div>
        </div>
  )
}

export default Adminsidebar
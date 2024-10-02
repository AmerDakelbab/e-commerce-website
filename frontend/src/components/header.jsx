import { MenuOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Header({ onMenuClick, totalCart, userId, setCartProducts }) {
  const [profileInfo, setProfileInfo] = useState(false);

  const toggleProfile = () => {
    setProfileInfo(!profileInfo);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCartProducts([]);
    message.success("Logout Successfully!");
    navigate('/login');
    window.location.reload();
  };


  return (
    <div className='bg-gray-800 w-screen flex justify-between fixed top-0 left-0 right-0 z-20 sm:h-12 m: h-16'>
      <div>
        <MenuOutlined onClick={onMenuClick} className="text-white text-2xl p-5 cursor-pointer" />
      </div>
      <div className='p-4'>
        <Link to='/'><p className='text-white text-2xl'>Logo</p></Link>
      </div>
      <div>
        <span className='absolute bg-red-700 text-white text-xs flex items-center justify-center w-6 h-6 top-2 right-16 rounded-full'>
          {totalCart}
        </span>
        <Link to='/cart'><ShoppingCartOutlined className="text-white text-2xl p-5 cursor-pointer relative" />
        </Link>
        <UserOutlined onClick={toggleProfile} className="text-white text-2xl p-5 cursor-pointer" />
        {profileInfo && <div className='bg-gray-800 p-5 mr-10 mt-3 fixed top-13 right-0 rounded-br-2xl rounded-bl-2xl rounded-tl-2xl' >
          <div>
            {!userId && <div className='flex flex-col p-2'>
              <Link to='/signup'><Button type='primary' className='mb-3 text-sm bg-white text-gray-800 w-20'>Signup</Button></Link>
              <Link to='/login'><Button className='text-sm text-gray-800 w-20'>Login</Button></Link>
            </div>}
            {userId && <Button onClick={handleLogout} type='primary' className='text-sm bg-white mb-3 text-gray-800 w-20 mt-3'>Logout</Button>}
          </div>
        </div>}
      </div>
    </div>
  )
}

export default Header;
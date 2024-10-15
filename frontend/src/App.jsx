import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import Cart from './components/cart';
import Header from './components/header';
import Home from './components/home'
import Sidebar from './components/sidebar';
import './index.css'
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import Checkout from './checkout';
import AddProducts from './components/Admin/AddProducts';
import ErrorPage from './ErrorPage';
import Adminsidebar from './components/Admin/adminsidebar';
import ViewUsers from './components/Admin/ViewUsers';
import ViewAdmins from './components/Admin/Viewadmins';
import { message } from 'antd';
import Viewcategories from './components/Admin/viewcategories.jsx';
import Addcategory from './components/Admin/addcategory.jsx';
import CategoryProducts from './components/CategoryProducts.jsx';
import Admin from './components/Admin/admin.jsx';


function App() {

  const [isVisible, setIsVisible] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("StoredToken", storedToken);

    if (storedToken) {
      setToken(storedToken);

      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token:", decodedToken);

        setUserId(decodedToken.userId || decodedToken.sub || decodedToken.id);
        console.log("Decoded UserId:", decodedToken.userId || decodedToken.sub || decodedToken.id);

        if (decodedToken.userRole === 'Admin') {
          navigate('/admin');
        }

        axios.get(`http://localhost:5000/cart`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
          .then((response) => setCartProducts(response.data))
          .catch((err) => console.error("Error", err));

      } catch (err) {
        console.error("Error decoding token", err);
      }
    } else {
      setUserId(null);
      setCartProducts([]);
    }
  }, [token]);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };


  const addToCart = (product) => {

    if (!token) {
      message.error("You Have To login!");
      navigate('/login')
    } else {

    const existingProduct = cartProducts.find(p => p.product_id === product.product_id);



    if (existingProduct) {
      axios.post(`http://localhost:5000/cart/increment`, {
        userId: userId,
        productId: product.product_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          setCartProducts(prevCartProducts =>
            prevCartProducts.map(p =>
              p.product_id === product.product_id
                ? { ...p, quantity: p.quantity + 1 }
                : p
            )
          );
        })
        .then(message.success("Product Quantity Incremented Successfully!", 10))
        .catch(error => console.error("Error Incrementing Product:", error.response?.data?.error || error.message));
    } else {
      axios.post(`http://localhost:5000/cart`, {
        userId: userId,
        productId: product.product_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => setCartProducts([...cartProducts, { ...product, quantity: 1 }]))
        .then(message.success("Product Added Successfully!", 5))
        .catch(error => console.error("Error Adding Product:", error.response?.data?.error || error.message));
    }}
  };

  const totalCart = cartProducts.reduce((total, product) => total + product.quantity, 0);



  return (
    <div>
      {!location.pathname.startsWith('/admin') && (
        <>
          <Sidebar isVisible={isVisible} setIsVisible={setIsVisible} />
          <div className={`flex-1 transition-all duration-300 ${isVisible ? 'ml-72' : ''}`}>
            <Header onMenuClick={toggleSidebar} totalCart={totalCart} setCartProducts={setCartProducts} setUserId={setUserId} userId={userId} />
          </div>
        </>
      )}
      {location.pathname.startsWith('/admin') && (
        <>
          <Adminsidebar />
        </>
      )}
      <Routes>
        <Route path='/' element={<Home addToCart={addToCart} isVisible={isVisible} />} />
        <Route path='/cart' element={<Cart userId={userId} cartProducts={cartProducts} totalCart={totalCart} setCartProducts={setCartProducts} isVisible={isVisible} />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/AddProducts' element={<AddProducts />} />
        <Route path='/admin/viewusers' element={<ViewUsers />} />
        <Route path='/admin/viewadmins' element={<ViewAdmins />} />
        <Route path='/admin/viewcategories' element={<Viewcategories />} />
        <Route path='/admin/addcategory' element={<Addcategory />} />
        <Route path="/categories/:name" element={<CategoryProducts addToCart={addToCart} isVisible={isVisible} />} />
        <Route path='/login' element={<Login setUserId={setUserId} userId={userId} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  )
};

export default App;

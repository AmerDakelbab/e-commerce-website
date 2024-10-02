import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Cart({ userId, setCartProducts, cartProducts, totalCart, isVisible }) {

  const token = localStorage.getItem('token');
  const [totalPrice,setTotalPrice] = useState(0);

  useEffect(() => {
    const total = cartProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    setTotalPrice(total.toFixed(2));
  }, [cartProducts]);

  const handleRemove = (productId) => {
    axios.delete(`http://localhost:5000/cart/${userId}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setCartProducts(prevCartProducts => prevCartProducts.filter(product => product.product_id !== productId));
        } else {
          console.error('Failed to remove product:', response.data.message);
        }
      })
      .catch(error => console.error('Error removing product from cart:', error));
  };

  const handleIncrement = (productId) => {
    axios.post('http://localhost:5000/cart/increment', { productId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setCartProducts(prevCartProducts =>
          prevCartProducts.map(product =>
            product.product_id === productId ? { ...product, quantity: product.quantity + 1 } : product
          )
        );
      })
      .catch(error => console.error('Error incrementing quantity:', error));
  };


  const handleDecrement = (productId) => {
    axios.post('http://localhost:5000/cart/decrement', { productId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setCartProducts(prevCartProducts =>
          prevCartProducts.map(product =>
            product.product_id === productId && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
          )
        );
      })
      .catch(error => console.error('Error decrementing quantity:', error));
  };
  return (
    <div className='flex justify-center'>
    <div className={`mt-32 mx-5 p-6 w-6/6 bg-gray-200 transition-all duration-300 ${isVisible ? 'ml-auto' : 'ml-0'} `}>
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <p className='my-10 xs: text-2xl font-bold mx-6'>Shopping Cart</p>
          <div className='text-2xl my-10 mx-6 text-red-500 font-bold'>{totalCart} items</div>
        </div>
        <div className='overflow-y-auto flex justify-center flex-col ' style={{ maxHeight: '60vh' }}>
          {cartProducts.length > 0 ? (
            cartProducts.map(product => (
              <div className='flex justify-center '>
              <div key={product.product_id} className='flex justify-center h-full w-full items-center overscroll-x-none bg-white mx-2 my-3 p-2 rounded-lg shadow-md sm: 2xl: '>
                <img className='w-32 h-32 object-contain' src={`http://localhost:5000/${product.image}`} alt={product.product_name} />
                <div className='flex w-full justify-between '>
                  <div className=' flex flex-col justify-center h-full'>
                    <h2 className='font-semibold'>{product.product_name}</h2>
                    <p className='font-bold'>{product.category}</p>
                  </div>
                  <div className='flex'>
                    <Button type='primary' className='w-1 h-6' onClick={() => handleDecrement(product.product_id)}>-</Button>
                    <p className='mx-2 type'>{product.quantity}</p>
                    <Button type='primary '  className='w-1 h-6' onClick={() => handleIncrement(product.product_id)}>+</Button>
                  </div>
                  <p className='font-extrabold text-1xl'>${(product.quantity * product.price).toFixed(2)}</p>
                  <Button type='danger' className='text-2xl font-bold text-red-500' onClick={() => handleRemove(product.product_id)}>X</Button>
                </div>
              </div>
              </div>
            ))

          ) : (

            <div className='flex flex-col align-middle justify-center items-center m-auto' style={{ height: '60vh' }}>
              <p>No products in the cart.</p>
              <Link to='/'><Button type='link' className='text-xl p-5 font-bold text-white-700 '>Back To Shop</Button></Link>
            </div>
          )}
        </div>
        <div className='flex justify-center'>  
          <p className='text-xl font-bold'>Total Price:<span className='text-red-500'>{totalPrice}$</span></p>
        </div>
        <div className='flex align-middle justify-center m-5'>
          <Link to='/checkout'><Button className='text-xl p-5 font-bold text-white-700 mx-5' type='primary'>Checkout</Button></Link>
          <Link to='/'><Button type='primary' className='text-xl p-5 font-bold text-white-700 mr-5'>Back To Shop</Button></Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Cart;
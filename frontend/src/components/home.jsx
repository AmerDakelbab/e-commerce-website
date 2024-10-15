import React, { useEffect, useState } from 'react'
import { Rate } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'





function Home({ addToCart, isVisible }) {

  const [products, setProducts] = useState([]);
  
  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

useEffect(() => {

  const hasLoggedIn = localStorage.getItem('hasLoggedIn');

        if (hasLoggedIn === 'true') {
            // Reload the page once
            window.location.reload();
            // Remove the flag to prevent further reloads
            localStorage.removeItem('hasLoggedIn');
        }

  fetch(`http://localhost:5000`)
    .then(response => response.json())
    .then(data => setProducts(shuffleArray(data)))
    .catch(error => console.error('Error fetching data:', error));
}, [])


return (
  <div className='bg-gray-200 h-screen w-screen overflow-scroll '>
<div className={`bg-gray-200 h-fit w-screen grid xs: grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 z-10 transition-all duration-300 ${isVisible ? 'ml-32 sm:ml-64 md:ml-64 lg:ml-64 xl:ml-64 2xl:ml-64' : 'ml-1'}`}>
  {products.map((product, index) => (
        <div key={index} className='flex flex-col ml-2 mt-20 p-4 bg-white w-48 justify-center items-center' >
          <div>
          <img className='h-60 w-60 object-cover' src={`http://localhost:5000/${product.image}`} alt={product.product_name} /> 

            <div className='flex'>
              <div className='font-bold'>{product.category}</div> /
              <div className='font-bold'>{product.product_name}</div>
            </div>
            <Rate allowHalf className='text-base' value={product.rating} />
            <div className='font-bold'>{product.price}$</div>
            <div className='font-bold'>{product.stock_status}</div>
            <ShoppingCartOutlined onClick={() => addToCart(product)} className='cursor-pointer' />
          </div>
        </div>))}
        </div>
        </div>
)}

export default Home;
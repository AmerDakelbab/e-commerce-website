import React, { useEffect, useState } from 'react';
import image from '../../photo/download.jpg';
import { Rate } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';



function WomenProducts({addToCart,isVisible}) {

  const [WomenProducts,setWomenProducts] = useState([]);

    useEffect(() => {
      fetch('http://localhost:5000/women')
      .then(response => response.json())
      .then(data => setWomenProducts(data) )
      .catch(err => console.error("Error handling man part",err));
    },[]);

    return (
      <div className={`bg-gray-200 h-full w-screen grid xs: grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 z-10 transition-all duration-300 ${isVisible ? 'ml-32 sm:ml-64 md:ml-64' : 'ml-1'}`}>
        {WomenProducts.map((product, index) => (
              <div key={index} className='flex flex-col ml-2 mt-20 p-4 bg-white w-48 justify-center items-center' >
                <div>
                <img className='h-60 object-fit' src={`http://localhost:5000/${product.image}`} alt={product.product_name} /> 
      
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
      )
  };

export default WomenProducts;
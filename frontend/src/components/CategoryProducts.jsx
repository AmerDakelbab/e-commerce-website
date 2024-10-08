import { ShoppingCartOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CategoryProducts({isVisible,addToCart}) {
  const { name } = useParams();
  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetch(`${process.env.REACT_BACKEND_URL}/categories/${name}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No products found or server error');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
     
      })
      .catch(err => {
        console.log("error",err);
 
      });
  }, [name]);


  return (
    <div className='bg-gray-200 h-screen w-screen overflow-hidden'>
  <div className={`bg-gray-200 h-full w-screen grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 z-10 transition-all duration-300 ${isVisible ? 'ml-32 sm:ml-64 md:ml-64 lg:ml-64 xl:ml-64 2xl:ml-64' : 'ml-1'}`}>
    
    {products.length === 0 ? (
      <div className="col-span-full h-full flex items-center justify-center">
        <p className='text-3xl text-center'>No products available in this category.</p>
      </div>
    ) : (
      products.map((product, index) => (
        <div key={index} className='flex flex-col ml-2 mt-20 p-4 bg-white w-48 justify-center items-center'>
          <div>
            <img className='h-60 w-60 object-fit' src={`${process.env.REACT_BACKEND_URL}/${product.image}`} alt={product.product_name} />
            <div className='flex'>
              <div className='font-bold'>{product.category}</div> /
              <div className='font-bold'>{product.product_name}</div>
            </div>
            <Rate allowHalf className='text-base' value={product.rating} />
            <div className='font-bold'>{product.price}$</div>
            <div className='font-bold'>{product.stock_status}</div>
            <ShoppingCartOutlined onClick={() => addToCart(product)} className='cursor-pointer' />
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
}

export default CategoryProducts;
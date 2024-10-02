import { Button, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

function AddProducts() {

    const { Option } = Select;
    const [productData, setProductData] = useState({
        product_name: '',
        category: '',
        price: '',
        stock_status: '',
        rating: '',
    });

    const [categories, setCategories] = useState([]);

    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/admin/viewcategories");
                setCategories(response.data);
                console.log("respose", response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('product_name', productData.product_name);
        formData.append('category', productData.category);
        formData.append('price', productData.price);
        formData.append('stock_status', productData.stock_status);
        formData.append('rating', productData.rating);

        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post("http://localhost:5000/admin/addproducts", formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                },
            });
            message.success("product added!");
            console.log("Data Sended", response.data);
            formData('');
        } catch (err) {
            if (err) throw err;
        };
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    }
    const handleStockChange = (value) => {
        setProductData({
            ...productData,
            stock_status: value
        });
    }

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleCategoryChange = (value) => {
        setProductData({
            ...productData,
            category: value
        });
    }

    return (
        <div className='mt-56 ml-40'>
            <p className='font-bold text-3xl mb-5'>Add Products</p>
            <form onSubmit={handleSubmit} encType='multipart/form-data' action='/upload'>
                <Input className='my-2' placeholder='name' value={productData.product_name} name='product_name' onChange={handleInput} />
                <Select
                    className='my-2 w-full'
                    placeholder='Select Category'
                    value={productData.category}
                    onChange={handleCategoryChange} // Set the category value
                >   
                <Option key='' value=''>Category?</Option>
                    {categories.map(category => (
                        <Option key={category.category_id} value={category.category_name}>
                            {category.category_name}
                        </Option>
                    ))}
                </Select>                <Input className='my-2' placeholder='price' value={productData.price} name='price' onChange={handleInput} />
                <Select
                    className='my-2 w-full'
                    placeholder='Select Stock Status'
                    value={productData.stock_status}
                    name='stock_status'
                    onChange={handleStockChange}
                >
                    <Option value=''>Stock?</Option>
                    <Option value='in_stock'>In Stock</Option>
                    <Option value='out_of_stock'>Out Of Stock</Option>
                </Select>
                <Input className='my-2' placeholder='rating' value={productData.rating} name='rating' onChange={handleInput} />
                <Input className='my-2' type='file' name='image' onChange={handleFileChange} />
                <Button type='primary' className='my-2 w-32' htmlType='submit'>Submit</Button>
            </form>
        </div>
    )
}

export default AddProducts;
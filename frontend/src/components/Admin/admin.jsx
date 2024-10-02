import { Button, Table, Modal, Input, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { EditFilled, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

function Admin() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editedProducts, setEditedProducts] = useState({
        product_name: '',
        category: '',
        price: '',
        stock_status: '',
        rating: '',
    });
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await fetch("http://localhost:5000/admin/viewproducts");
                const productsData = await productsResponse.json();
                setProducts(productsData);

                const categoriesResponse = await fetch("http://localhost:5000/admin/viewcategories");
                const categoriesData = await categoriesResponse.json();
                console.log(categoriesData); // Check the structure of the fetched data
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []);

    const dataSource = products.map((product) => ({
        key: product.product_id,
        product_name: product.product_name,
        category: product.category,
        price: product.price,
        stock_status: product.stock_status,
        rating: product.rating,
        image: product.image,
    }));

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={`http://localhost:5000/${image}`} alt='product' className='w-16 h-16 object-contain' />
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price}$`,
        },
        {
            title: 'Stock Status',
            dataIndex: 'stock_status',
            key: 'stock_status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button type='primary' onClick={() => handleEdit(record)}><EditFilled /></Button>
                    <Button onClick={() => handleDelete(record.key)} type='primary' className='bg-red-500'><DeleteOutlined /></Button>
                </div>
            )
        },
    ];

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/viewproducts/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                message.success("Product Deleted Successfully!");
                setProducts(products.filter(product => product.product_id !== productId));
            } else if (response.status === 404) {
                message.error('Product not found!');
            } else {
                message.error('Couldnt delete: Someone Have it in Cart!');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred while deleting the product');
        }
    };

    const handleEdit = (product) => {
        setEditedProducts(product); // Ensure `product` has all required fields
        setCurrentProductId(product.key);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const formData = new FormData();
        formData.append('product_name', editedProducts.product_name);
        formData.append('category', editedProducts.category);
        formData.append('price', editedProducts.price);
        formData.append('stock_status', editedProducts.stock_status);
        formData.append('rating', editedProducts.rating);

        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/admin/viewproducts/${currentProductId}`, formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Include the token in the request
                },
            });
            message.success("Updated Succesfully!");
            window.location.reload();
        } catch (err) {
            console.error("Error updating product:", err);
            alert('Failed to update product: ' + (err.response ? err.response.data.message : err.message));
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setEditedProducts({
            ...editedProducts,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };
    const handleCategoryChange = (value) => {
        console.log("SELECT CATEGORY", value);
        setEditedProducts({
            ...editedProducts,
            category: value
        });
    };

    return (
        <div className='ml-44 mt-20'>
            <Table className=''  size='small' dataSource={dataSource} 
            columns={columns}
            pagination={{pageSize:8}} />
        
            <Modal
                title="Edit Product"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <form>
                    <Input type='file' name='image' onChange={handleFileChange} />
                    <Input type='text' name='product_name' value={editedProducts.product_name} onChange={handleInput} placeholder='Product Name' />
                    <Select
                        name='category'
                        value={editedProducts.category}
                        onChange={handleCategoryChange}
                        placeholder='Select Category'
                        className='w-full'
                    >
                        {categories.map((category) => (
                            <Option key={category.category_id} value={category.category_name}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                    <Input type='number' name='price' value={editedProducts.price} onChange={handleInput} placeholder='Price' />
                    <Input type='text' name='stock_status' value={editedProducts.stock_status} onChange={handleInput} placeholder='Stock Status' />
                    <Input name='rating' value={editedProducts.rating} onChange={handleInput} placeholder='Rating' />
                </form>
            </Modal>
        </div>
    );
}

export default Admin;
import { Button, Table, Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { EditFilled, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

function Viewcategories() {
    const [categories, setCatgories] = useState([]);
    const [editedCategories, setEditedCategories] = useState({
        category_name: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/admin/viewcategories`)
            .then(response => response.json())
            .then(data => setCatgories(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const dataSource = categories.map((Category) => ({
        key: Category.category_id,
        category_name: Category.category_name,
    }));

    const columns = [
        
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
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

    const handleDelete = async (CategoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/Viewcategories/${CategoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                alert('Category deleted successfully');
                window.location.reload();
                setCatgories(categories.filter(Category => Category.Category_id !== CategoryId));
            } else if (response.status === 404) {
                alert('Category not found!');
            } else {
                alert('Error deleting Category');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the Category');
        }
    };

    const handleEdit = (Category) => {
        setEditedCategories(Category);
        setCurrentCategoryId(Category.key);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('You must be logged in to perform this action.');
            return;
        }
    
        try {
            // Include the category_name in the body of the request
            const response = await axios.put(`http://localhost:5000/admin/Viewcategories/${currentCategoryId}`, {
                category_name: editedCategories.category_name, // Pass the updated category name here
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the request
                    'Content-Type': 'application/json', // Set the correct content type
                },
            });
            console.log("Data Updated", response.data);
            
            // Optionally update state to reflect changes without reloading
            setCatgories(categories.map(category => 
                category.category_id === currentCategoryId 
                ? { ...category, category_name: editedCategories.category_name } 
                : category
            ));
            window.location.reload(); // Reload page to reflect changes
        } catch (err) {
            console.error("Error updating Category:", err);
            alert('Failed to update Category: ' + (err.response ? err.response.data.message : err.message));
        }
    };
    

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setEditedCategories({
            ...editedCategories,
            [name]: value
        });
    };


    return (
        <div className='ml-44 mt-20'>
            <Table className='' pagination={{pageSize:8}} size='small' dataSource={dataSource} columns={columns} />
            <Modal
                title="Edit Category"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <form>
                    <Input type='text' name='category_name' value={editedCategories.category_name} onChange={handleInput} placeholder='Category Name' /> 
                </form>
            </Modal>
        </div>
    );
}

export default Viewcategories;
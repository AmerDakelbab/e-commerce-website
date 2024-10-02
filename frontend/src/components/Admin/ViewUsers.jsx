import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { EditFilled,DeleteOutlined } from '@ant-design/icons'

function ViewUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/admin/viewusers")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [])
    console.log(users);
    const dataSource = users.map((user,index) => ({
        key:index,
        userId:user.user_id,
        email: user.email,
        username: user.username,
        userRole: user.userRole,
    }));

    const columns = [        
        {
            title: 'UserID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'userRole',
            dataIndex: 'userRole',
            key: 'userRole',
        },

    ];


    return (
        <div className='ml-44 mt-20'>
            <Table className='' pagination={{pageSize:8}} size='small' dataSource={dataSource} columns={columns} />
        </div>
    )
}

export default ViewUsers
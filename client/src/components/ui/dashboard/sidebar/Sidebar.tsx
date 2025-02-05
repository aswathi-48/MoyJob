"use client"
import React, { useEffect, useState } from 'react'
import styles from './sidebar.module.css'
import { title } from 'process'
import MenuLink from './menulink/MenuLink'
import Image from 'next/image'
import user from '../../../../../public/image/user.png'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'

const menuItems = [
    {
        title: "Dashboard",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard"
            },
        ]
    },
    {
        title: "Users",
        list: [
            {
                title: "User",
                path: "/dashboard/users"
            }
        ]
    },
    {
        title: "Jobs",
        list: [
            {
                title: "Job",
                path: "/dashboard/jobs"
            }
        ]
    },
    {
        title: "Company",
        list: [
            {
                title: "Company",
                path: "/dashboard/company"
            }
        ]
    },
    {
        title: "Subscribers",
        list: [
            {
                title: "Subscribers",
                path: "/dashboard/subscribers"
            }
        ]
    },
    {
        title: "Applications",
        list: [
            {
                title: "Applications",
                path: "/dashboard/applications"
            }
        ]
    },
]


const Sidebar = () => {
    const router = useRouter()
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('adminId');
        localStorage.removeItem('first_name');
        localStorage.removeItem('gender');
        router.push('/login');
    };


    // const [userEmail, setUserEmail] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem("first_name");
        // const storedUserEmail = localStorage.getItem("email")
        setUsername(storedUsername);
        // setUserEmail(storedUserEmail)
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.user} >
                <Image src={user} alt='' width="50" height="50" />
                <div style={{ color: 'white', marginLeft: "10px", marginTop:"10px"}}>
                    {username}
                    {/* {userEmail} */}
                </div>
            </div>
            <ul className={styles.list}>
                {menuItems.map(cat => (
                    <li key={cat.title}>
                        {cat.list.map(item => (
                            <MenuLink item={item} key={item.title} />
                        ))}
                    </li>
                ))}
            </ul>
            <div style={{
                marginLeft: "65px",
                color: "white"
            }}>

            <Button onClick={handleLogout}>Logout</Button> <br/>
            <Button onClick={()=> router.push('/home')} sx={{  }}> Home Page</Button>
            </div>

        </div>
    )
}

export default Sidebar
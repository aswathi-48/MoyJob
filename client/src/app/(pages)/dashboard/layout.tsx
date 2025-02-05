import Navbar from '@/components/ui/dashboard/navbar/Navbar'
import Sidebar from '@/components/ui/dashboard/sidebar/Sidebar'
import React from 'react'
import styles from '../../../components/ui/dashboard/Dashboard.module.css'

const layout = ({children}:any) => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar/>
        </div>
        <div className={styles.content}>
            <Navbar/>
            {children}
        </div>
    </div>
  )
}

export default layout
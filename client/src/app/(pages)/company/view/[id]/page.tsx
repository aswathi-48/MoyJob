"use client"
import CompanyViewCard from '@/components/company/CompanyViewCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface Values {
  _id: string,
  company_name: string,
  email: string
  description: string
  location: {
    city: string,
    cordinates: {
      lat: number,
      lng: number
    }
  },
  user: {
    userId: string;
    first_name: string,
    role: string
  }| null;
}

const page = ({ params }: { params: { id: string } }) => {

  const [company, setCompany] = useState<Values>({
    _id:"",
    company_name: "",
    email: "",
    description: "",
    location: {
      city: "",
      cordinates: {
        lat: 0,
        lng: 0
      }

    },
    
    user: {
      userId: '',
      first_name: '',
      role: ''
    }
  })
  
  useEffect(() => {

    const fetchCompany = async () => {
      
      const storedToken = localStorage.getItem("access_token")
      const response = await axios.post("http://localhost:5100/company/view", { comapny_id: params.id },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }).then((res) => {
          const fetchData = res.data
          setCompany(fetchData.data);
        })
    }
    fetchCompany()
  }, [setCompany])
  console.log(company,"comapny");
  
  return (
    <div>
      <h2 style={{color:"white" }}>

        <CompanyViewCard _id = { params.id} data={company}/>
      </h2>
    </div>
  )
}

export default page
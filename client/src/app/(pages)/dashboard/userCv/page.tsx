"use client"
import { fetchSkills } from '@/redux/skill/skillSlice'
import { RootState } from '@/redux/store'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ListUserCv = () => {

    const dispatch = useDispatch<any>()
    const [searchTerm, setSearchTerm] = useState('');
    const skills = useSelector((state: RootState) => state.skill)
    console.log(skills,"skills");

    useEffect(() => {
        dispatch(fetchSkills({q: searchTerm}))
    },[dispatch, searchTerm])
    

    const columns: GridColDef[] = [
        { field: 'cv', headerName: 'Cv ', width: 200,
        renderCell: (skills) => {
          return <>
          {/* <img src={skills.row.cv} alt="user" /> */}
          {skills.row.cv}
      
          </>
        }
       },
       {
        field: 'user._id',headerName: 'UserId', width: 250,
        renderCell: (params) => params.row.user._id
       },
       { 
        field: 'user.first_name', 
        headerName: 'First Name', 
        width: 200,
        renderCell: (params) => params.row.user.first_name
    },
        { field: 'skills', headerName: 'Skills', width: 350}
    ]
  return (
    <div>       
        <DataGrid
                getRowId={(row) => row._id}
                rows={skills.skills }
                columns={columns}
                rowHeight={100}
                initialState={{
                    pagination: { paginationModel: { pageSize: 3 } }
                }}
                pageSizeOptions={[3, 5, 20]}
            />
    </div>
  )
}

export default ListUserCv
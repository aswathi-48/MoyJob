"use client"
import { fetchAllApplications } from '@/redux/application/applicationSlice'
import { RootState } from '@/redux/store'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {

    const dispatch = useDispatch<any>()
    const applications = useSelector((state: RootState) => state.application)
    console.log(applications,"appliactions");

    useEffect(() => {
        dispatch(fetchAllApplications())
    }, [ dispatch ])


    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 20,
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
        },
        { field: 'email', headerName: 'Email', width: 290 },
        { field: 'skills', headerName: 'Skills', width: 190 },
        { 
            field: 'job_title', 
            headerName: 'Job Title', 
            width: 150,
            renderCell: (params) => params.row.job?.job_title || '',
        },        { field: 'message', headerName: 'Message', width: 280 },
    ]

  return (
    <div>
      <DataGrid
                getRowId={(row) => row._id}
                rows={ applications.applications}
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

export default page
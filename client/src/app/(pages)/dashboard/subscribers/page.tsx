"use client";
import { RootState } from '@/redux/store';
import { Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/components/style/Style.css';
import { fetchSubscribedUser } from '@/redux/company/companySlice';

const AdminViewSubscribers = () => {
  const dispatch = useDispatch<any>();
  const subscribers = useSelector((state: RootState) => state.company.subscribers);
  console.log(subscribers);
  

  useEffect(() => {
    dispatch(fetchSubscribedUser());
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    { 
      field: 'image', 
      headerName: 'image', 
      width: 100,
      renderCell: (params) => (
        params.row.user && params.row.user.image ? (
          <img src={params.row.user.image} alt="user" style={{ width: '50px', height: 'auto', borderRadius: "50px" }} />
        ) : null
      )
    },
   
    { 
      field: 'first_name', 
      headerName: 'User Name', 
      width: 100, 
      renderCell: (params) => (
        params.row.user && params.row.user.first_name ? params.row.user.first_name : ''
      )
    },
        { field: 'email', headerName: 'User Email', width: 200, renderCell: (params) => params.row.user.email },
    // { field: 'gender', headerName: 'User Gender', width: 100, renderCell: (params) => params.row.user.gender },
      // { field: 'date_of_birth', headerName: 'Date Of Birth', width: 100, renderCell: (params) => new Date(params.row.user.date_of_birth).toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }) },
    { field: 'company_name', headerName: 'Company Name', width: 150, renderCell: (params) => params.row.company.company_name },
    { field: 'email', headerName: 'Company Email', width: 150, renderCell: (params) => params.row.company.email },
    { field: 'description', headerName: 'Company Description', width: 200, renderCell: (params) => params.row.company.description },
  ];

  return (
    <div>
      {subscribers && subscribers.length > 0 ? ( // Add null check for subscribers
        <DataGrid
        getRowId={(row) => row.user ? row.user._id : ''}
        rows={subscribers}
          columns={columns}
          rowHeight={100}

          pageSizeOptions={[3, 5, 20]}
        />
      ) : (
        <Typography variant="body1">No subscribers found.</Typography>
      )}
    </div>
  );
};

export default AdminViewSubscribers;
"use client"
import { RootState } from '@/redux/store';
import { deleteUser, fetchUser } from '@/redux/user/userSlice';
import { Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import '@./style/Style.css'
import '../../../../components/style/Style.css'
import { useRouter } from 'next/navigation';
const AdminUserView = () => {

  const dispatch = useDispatch<any>()
  const users = useSelector((state: RootState) => state.user.users);
  console.log(users, "user");
  const router=useRouter()
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleDelete = async (userId: string) => {
    await dispatch(deleteUser({userId}));

};

  const columns: GridColDef[] = [

    {
      field: 'id', headerName: 'ID',
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
  },
  { field: 'image', headerName: 'image ', width: 100,
  renderCell: (users) => {
    return <>
    <img src={users.row.image} alt="user" style={{ width: '50px', height: 'auto', borderRadius: "50px" }} />

    </>
  }
 },
    { field: 'first_name', headerName: ' Name', width: 100 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 150 },
    { field: 'skills', headerName: 'Skills', width: 150 },
    { field: 'date_of_birth', headerName: 'Date Of Birth', width: 100,
    renderCell: (params) => (
      <>
          {new Date(params.row.date_of_birth).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
          })}
      </>
  ), },
  
  //   {
  //     field: 'actions', headerName: 'Actions', width: 300,
  //     renderCell: (params) => (
  //         <>

  //             <Button
  //                 onClick={() => handleDelete(params.row.userId)}
  //                 style={{ marginLeft: "10px", marginTop: "20px", color: "white", background: "red" }}
  //             >
  //                 Delete
  //             </Button>
  //         </>
  //     ),
  // },

  ]

  return (
    <div>
      <Typography variant='h4'></Typography>
      <DataGrid
        getRowId={(row) => row._id}
        rows={users}
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

export default AdminUserView
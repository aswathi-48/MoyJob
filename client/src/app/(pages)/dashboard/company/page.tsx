"use client"
import { deleteCompany, fetchCompany } from '@/redux/company/companySlice';
import { Button, CardActions, Grid, IconButton, InputBase, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search';
import AddCompanyUser from '@/components/company/AddCompanyUser';
import AddCompany from '@/components/company/AddCompany';
import '../../../../components/style/Style.css'

    const AdminCompanyView = () => {
    
    const dispatch = useDispatch<any>()
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleted, setDeleted] = useState(false);
    const companies = useSelector((state: any) => state.company.companies);

    const [addOpen, setAddOpen] = useState(false);
    const [companyAddpen, setCompanyAddOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchCompany({ q: searchTerm }));
    }, [ dispatch, searchTerm, , deleted ]);

    const handleDelete = async(_id: string) => {
        setDeleted(true)
        await dispatch(deleteCompany({_id}))
        setDeleted(false);
    }
    

    const handleAddOpen = () => {
        setAddOpen(true);
      };
      const handleAddClose = () => {
        setAddOpen(false);
      };
      const handleCompanyAddOpen = () => {
        setCompanyAddOpen(true);
      };
      const handleCompanyAddClose = () => {
        setCompanyAddOpen(false);
      };

    const columns: GridColDef[] = [

        { field: 'company_name', headerName: 'company_name ', width: 200 },
        { field: 'email', headerName: 'contact ', width: 200 },
        { field: 'description', headerName: 'description ', width: 200 },

        {
            field: 'actions', headerName: 'Actions', width: 300, 
            renderCell: (params) => (
                <>
                    <Button
                        onClick={() => router.push(`/company/edit/${params.row._id}`)}
                        style={{ marginLeft: "30px", marginTop: "20px", color: "white", background: "#000080" }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row._id)}
                        style={{ marginLeft: "10px", marginTop: "20px", color: "white", background: "red" }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },

    ]

    return (
        <div>
              <Grid container spacing={2}>
                <Grid item xs={8}>
            <Paper component="form" sx={{ ml: "70px", mt: "30px", p: '4px 4px', display: 'flex', alignItems: 'center', width: 450, color: "white", mb: "30px" }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by job title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            </Grid>
            <Grid item xs={4}>
                <CardActions> 
            <Button   onClick={handleAddOpen}
            sx = {{ 
                border:"1px solid",
                mt:"10%"
             }}>
                Add Company User
            </Button>
            <Button   onClick={handleCompanyAddOpen}
            sx = {{ 
                border:"1px solid",
                mt:"10%"
             }}>
                Add Company 
            </Button>
                </CardActions>
            </Grid>       
            </Grid>

       {/* <ProfileView  /> */}
            <DataGrid
                getRowId={(row) => row._id}
                rows={companies}
                columns={columns}
                rowHeight={100}
                initialState={{
                    pagination: { paginationModel: { pageSize: 3 } }
                }}
                pageSizeOptions={[3, 5, 20]}
            />
            <AddCompanyUser  open={addOpen} handleClose={handleAddClose}/>
            <AddCompany open={companyAddpen} handleClose={handleCompanyAddClose}/>
        </div>
    )
}

export default AdminCompanyView
"use client";
import { deleteJob, fetchJobs } from '@/redux/job/jobSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Chip, Grid, IconButton, InputBase, Paper } from '@mui/material';
import '@/components/style/Style.css'
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import { fetchCompany } from '@/redux/company/companySlice';
import { RootState } from '@/redux/store';
import AddNewJob from '@/components/job/AddJob';


const AdminJobView = () => {
    const dispatch = useDispatch<any>();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [categoryFilter,setCategoryFilter] = useState('')
    const  jobs  = useSelector((state: RootState) => state.job);
    const company = useSelector((state: RootState) => state.company.companies);
  console.log(company,"companyyy");
  
    
    const router = useRouter();
    const [deleted, setDeleted] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    

    const handleAddOpen = () => {
      setAddOpen(true);
    };
    const handleAddClose = () => {
      setAddOpen(false);
    };

    useEffect(() => {
        dispatch(fetchCompany({q: searchTerm}))
    }, [dispatch, searchTerm])
  
    useEffect(() => {
        dispatch(fetchJobs({ q: searchTerm, job_type: typeFilter, category: categoryFilter }));
    }, [dispatch, searchTerm, typeFilter,categoryFilter, deleted]);


    const handleDelete = async (_id: string) => {
        setDeleted(true);
        await dispatch(deleteJob({_id}));
        setDeleted(false);
    };

    const getStatusChip = (status: string) => {
        return status === 'Active' ? (
          <Chip label="Active"  color="success" variant='outlined'/>
        ) : (
          <Chip label="InActive" color="error"  variant='outlined'  />
        );
      };
    

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 20,
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
        },
        { field: 'job_title', headerName: 'Job Title', width: 150 },
        { field: 'job_type', headerName: 'Job Type', width: 100 },
        { field: 'salary', headerName: 'Salary', width: 100 },
        { field: 'category', headerName: 'Category', width: 100 },
        { field: 'requirements', headerName: 'requirements', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => getStatusChip(params.value),
          },

        {
            field: 'posted_date', headerName: 'Posted Date', width: 100,
            renderCell: (params) => (
                <>
                    {new Date(params.row.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                    })}
                </>
            ),
        },
        { field: 'description', headerName: 'description', width: 100 },

        {
            field: 'actions', headerName: 'Actions', width: 300,
            renderCell: (params) => (
                <>
                    <Button
                        onClick={() => router.push(`/job/edit/${params.row._id}`)}
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
    ];
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
            <Button   onClick={handleAddOpen}
            sx = {{ 
                border:"1px solid",
                mt:"10%"
             }}>
                Add New Job
            </Button>
            </Grid>       
            </Grid>
            <DataGrid
                getRowId={(row) => row._id}
                rows={jobs.jobs }
                columns={columns}
                rowHeight={100}
                initialState={{
                    pagination: { paginationModel: { pageSize: 3 } }
                }}
                pageSizeOptions={[3, 5, 20]}
            />
            <AddNewJob open={addOpen} handleClose={handleAddClose} companies={company}/>
        </div>
    );
}
export default AdminJobView;






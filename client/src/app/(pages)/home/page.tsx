
"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/job/jobSlice';
import CardVariants from '@/components/job/BasicCard';
import {
  Box, Grid, Paper, InputBase, IconButton, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Typography, Button, Dialog, Slide
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import img from '../../../../public/image/job.jpg';
import img2 from '../../../../public/image/img.jpg';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Page = () => {
  const jobs = useSelector((state: any) => state.job.jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // Number of jobs to display per page
  
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const [addOpen, setAddOpen] = useState(false);
  const [latestJobs, setLatestJobs] = useState([]);
  const [notificationIcon, setNotificationIcon] = useState(false); // State for notification icon

  const handleAddOpen = () => {
    setAddOpen(true);
    setNotificationIcon(false);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  useEffect(() => {
    dispatch(fetchJobs({ q: searchTerm, job_type: typeFilter, category: categoryFilter }));
  }, [dispatch, searchTerm, typeFilter, categoryFilter]);

  useEffect(() => {
    // Fetch latest 5 jobs
    const fetchLatestJobs = async () => {
      const response = await fetch('http://localhost:5100/job/latest', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      const data = await response.json();
      // setLatestJobs(data.data);
      setLatestJobs(data.data || []);
    };

    fetchLatestJobs();
  }, []);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/job/view/${jobId}`);
  };

  return (
    <div>
      <Box sx={{ padding: "20px" }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '300px',
            backgroundImage: `url(${img.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper component="form" sx={{ ml: "10px", mt: "20px", p: '4px 4px', display: 'flex', alignItems: 'center', width: '90%', maxWidth: '600px', color: "white" }} >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs..."
              fullWidth
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                height: "230px",
                width: "100%",
                mt: "10px",
                backgroundImage: `url(${img2.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <CardContent>
                <Typography sx={{
                  color: "white",
                  padding: "20px",
                  fontFamily: "monospace",
                  fontSize: "20px"
                }}>
                  Get Your Best Profession With LuckyJob
                </Typography>
              </CardContent>
            </Card>
            <Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: "100%", mt: "48px" }}>
                  <InputLabel id="job-type-label">Job Type</InputLabel>
                  <Select
                    labelId="job-type-label"
                    id="job-type-select"
                    value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All Type</MenuItem>
                    <MenuItem value="full-time">Full Time</MenuItem>
                    <MenuItem value="part-time">Part Time</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: "100%", mt: "48px" }}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="developer">Development</MenuItem>
                    <MenuItem value="backend-developer">Backend Development</MenuItem>
                    <MenuItem value="front-developer">Front Development</MenuItem>
                    <MenuItem value="ui/ux-developer">UI/UX Development</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={9}>
            <Box>
              <Box sx={{ 
                display: "flex",
                justifyContent: "space-between"
               }}>

              <Typography variant='h4' sx={{ mt: "10px" }}>
                Recommended Jobs
              </Typography>
              <Button onClick={handleAddOpen}>
                <NotificationsIcon/>
              </Button>              
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2 }}>
                {currentJobs.map((job: any, index: any) => (
                  <Box key={index}>
                    <CardVariants data={job} />
                  </Box>
                ))}
              </Box>
              <Pagination
                count={Math.ceil(jobs.length / jobsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={addOpen}
        TransitionComponent={(props) => <Slide direction="left" {...props} />}
        keepMounted
        onClose={handleAddClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}
      >
        <Box sx={{ padding: "20px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Latest Jobs
          </Typography>
          {latestJobs.map((job: any, index: any) => (
          <Link href={{ pathname: `/job/view/${job._id}` }} style={{ textDecoration: 'none' }}>
            <Card key={index} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleJobClick(job._id)}>
              <CardContent>
                <Typography variant="h6">{job.job_title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company.company_name} - {new Date(job.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
            </Link>
          ))}
          <Button onClick={handleAddClose} color="primary">
            Close
          </Button>
        </Box>
      </Dialog>
    </div>  
  );
}

export default Page;
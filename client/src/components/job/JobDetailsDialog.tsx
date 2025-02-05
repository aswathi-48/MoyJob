"use client";
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '@/redux/job/jobSlice';
import { RootState } from '@/redux/store';
import BasicCard from '@/components/job/Card';


interface JobDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
}
const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ open, onClose, jobId }) => {
  const dispatch = useDispatch<any>();
  const singleJob = useSelector((state: RootState) => state.job.singleJob);
 
  useEffect(() => {
    
    if (jobId && open) {
      dispatch(fetchJobById(jobId));
    }

  }, [dispatch, jobId, open]);
 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Job Details</DialogTitle>
      <DialogContent>
        {singleJob ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">{singleJob.job_title}</Typography>
              <Typography variant="body1">Company: {singleJob.company.company_name}</Typography>
              {/* <Typography variant="body1">Location: {singleJob.company.location}</Typography> */}
              <Typography variant="body1">Type: {singleJob.job_type}</Typography>
              <Typography variant="body1">Posted: {singleJob.createdAt}</Typography>
              <Typography variant="body1">Salary: ${singleJob.salary}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default JobDetailsDialog;
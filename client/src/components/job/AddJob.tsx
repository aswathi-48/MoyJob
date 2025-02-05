
"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, TextareaAutosize } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { addNewJobs } from '@/redux/job/jobSlice';
import Textarea from '@mui/joy/Textarea';
import { toast } from 'react-toastify';

interface FormData {
  company: {
    _id: string
    company_name: string;
    location: string;
  };

  job_title: string;
  job_type: string,
  salary: number | string
  category: string
  description: string,
  requirements: string[]
  status: string
  createdAt: string,
  interviewScheduledAt: string
}




export default function AddNewJob({ open, handleClose, companies }: { open: any, handleClose: any, companies: any }) {

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const jobs = useSelector((state: any) => state.job.job)
  console.log(companies, "companieee");

  const dispatch = useDispatch<any>();

  const handleSave = (formData: any) => {
    dispatch(addNewJobs(formData));
    handleClose();
    toast.success('Job added successfully'); 
  };



  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          Add New Jobs:
        </DialogContentText>

        <FormControl fullWidth >
          <InputLabel id="demo-simple-select-label">Comapny</InputLabel>

          <Controller  
            name="company._id"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                
                labelId="company-select-label"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  const selectedCompany = companies.find((company: any) => company._id === value);
                  if (selectedCompany) {
                    setValue('company.company_name', selectedCompany.company_name);
                    setValue('company.location', selectedCompany.location);
                  }
                }}
              >
                {companies.map((company: any) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
            )}
            
          />
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Job Title"
          type="text"
          fullWidth
          {...register("job_title", { required: true })}
          error={!!errors.job_title}
          helperText={errors.job_title ? errors.job_title.message : ""}
          name='job_title'
          
        />
        <FormControl fullWidth >
          <InputLabel id="demo-simple-select-label">Job Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            {...register("job_type", { required: true })}
            error={!!errors.job_type}
            // helperText={errors.job_type ? errors.job_type.message : ""}
            name='job_type'
          >
            <MenuItem value={"part-time"}>Part Time</MenuItem>
            <MenuItem value={"full-time"}>Full Time</MenuItem>
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Salary"
          type="number"
          fullWidth
          {...register("salary", { required: true })}
          error={!!errors.salary}
          helperText={errors.salary ? errors.salary.message : ""}
           name='salary'
        />
        <Stack spacing={3} sx={{ width: 500 }}>
          <Autocomplete
            multiple
            id="tags-standard"
            options={OurRequirements}
            getOptionLabel={(option) => option.title}
            defaultValue={[OurRequirements[0]]}
            onChange={(event, value) => {
              setValue("requirements", value.map((option) => option.title));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Requirements"
                placeholder="Favorites"
              />
            )}
          />

        </Stack>
        <FormControl fullWidth >
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            {...register("category",{ required: true })}
             error={!!errors.category}

            name='category'
          >
            <MenuItem value={"developer"}>Developer</MenuItem>
            <MenuItem value={"backend-developer"}>Backend Development</MenuItem>
            <MenuItem value={"front-developer"}>Front Development</MenuItem>
            <MenuItem value={"ui/ux-developer"}>UI/UX Development</MenuItem>
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          {...register("description",{ required: true })}
          name='description'
          error={!!errors.description}
        />
                <TextField
          autoFocus
          margin="dense"
          type="date"
          fullWidth
          {...register("interviewScheduledAt",{ required: true })}
          name='interviewScheduledAt'
          error={!!errors.interviewScheduledAt}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSave)} >Save</Button>
      </DialogActions>
    </Dialog>
  );
}


const OurRequirements = [
  { title: 'HTML' },
  { title: 'CSS' },
  { title: 'JavaScript' },
  { title: 'ReactJs' },
  { title: 'NextJs' },
  { title: 'Python' },
  { title: 'NodeJs' },
  { title: 'Photoshop' },
  { title: 'Figma' },
  { title: 'TypeScript' },
]
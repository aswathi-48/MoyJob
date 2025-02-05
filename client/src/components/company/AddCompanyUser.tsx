"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {

  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | Date;
  gender: string;
  role: string;
  password: string
  image: FileList;
}

export default function AddCompanyUser({ open, handleClose } : {open: any, handleClose: any}) {

    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  const { register, handleSubmit } = useForm<FormData>();
//   const employees =useSelector((state:any) => state.employee.employees)
//   const dispatch = useDispatch<any>();

  const handleSave = async (data: FormData) => {
    console.log("data");
    
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);
    formData.append("gender", data.gender);
    formData.append("date_of_birth", data.date_of_birth as string);
    formData.append("image",data.image[0]);
    const storedToken = window.localStorage.getItem("access_token")
    const response = await axios.post('http://localhost:5100/user/register', formData);
    console.log(response.data);
    handleClose();
  };

 
  const handleImageChange = (e:any) => {
    const file = URL.createObjectURL(e.target.files[0])
    setImagePreview(file)
  };
  
 
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add Company User:
        </DialogContentText>
        
        <TextField
          autoFocus
          margin="dense"
          label="first_name"
          type="text"
          fullWidth
          {...register("first_name")}
        />
        <TextField
          margin="dense"
          label="last_name"
          type="text"
          fullWidth
          {...register("last_name")}
        />
            <TextField
          autoFocus
          margin="dense"
          label="email"
          type="text"
          fullWidth
          {...register("email")}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          {...register("password")}
        />
           <TextField
          margin="dense"
          type="date"
          fullWidth
          {...register("date_of_birth")}
        />
           <TextField
          margin="dense"
          label="role"
          type="text"
          defaultValue={"marketing"}
          fullWidth
          {...register("role")}
        />
            <Grid item xs={12} sm={6}>
               <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                    <FormControlLabel 
                     {...register("gender")}
                    id='gender' value="female" control={<Radio />} label="Female"/>
                    <FormControlLabel 
                     {...register("gender")}
                  id='gender' value="male" control={<Radio />} label="Male" />
                  </RadioGroup>
            </Grid>
            <Grid item xs={12}>
           {imagePreview && ( 
             <Grid item xs={12}>
               <img src={imagePreview.toString()} alt="Preview" style={{ maxWidth: '15%', marginTop:"15px", marginLeft:'38%'}} />
             </Grid>
           )}
            <TextField
              required 
              fullWidth
              type="file" 
              id="image" {...register("image")} 
              onChange={handleImageChange}
            />
          </Grid>
      
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSave)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}


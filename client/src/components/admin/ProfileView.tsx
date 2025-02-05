import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Box } from '@mui/material';
import { format } from 'date-fns';
import { editUser } from '@/redux/user/userSlice';

  export interface Data {
  userId: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  role: string;
  image: string;
  skills: string[]
}

const defaultData: Data = {
  userId: "",
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  email: "",
  role: "",
  image: "",
  skills: []
};

const ProfileView = ({ params }: { params: { id: string } }) => {
  const [formValue, setFormValue] = useState(defaultData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Data>();
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("access_token");
      const response = await axios.post("http://localhost:5100/user/profile", { userId: params.id }, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      const fetchData = response.data;
      setFormValue(fetchData.data);
      reset(fetchData.data);
    }
    fetchUser();
  }, [reset, params.id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd/yyyy');
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const onSubmit: SubmitHandler<Data> = async (data: any) => {
    const formData = new FormData();
    formData.append("_id", params.id)
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("gender", data.gender);
    formData.append("image", image);
    dispatch(editUser(data))
    handleEditClose()
  };

  const handleInputChange = (e: any) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setImage(file);
  };


  return (
    <Box>
      <h1>User Profile</h1>
      <ul>
        <img src={formValue.image} alt="" style={{
          borderRadius: "50px",
          marginLeft: "30%",
          width: '100px'
        }} />
        <Card>
          <CardContent sx={{ textAlign: 'center', width: "300px" }}>
            <Typography>{formValue.first_name} {formValue.last_name}</Typography>
            <Typography>{formValue.email}</Typography>
            <Typography>{formValue.gender}</Typography>
            <Typography>Date of Birth: {formValue.date_of_birth && formatDate(formValue.date_of_birth)}</Typography>
            <Button variant="contained" color="primary" onClick={handleEditClick}>
              Edit
            </Button>
          </CardContent>
        </Card>
      </ul>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {imagePreview ?
              <Grid item xs={12}>
                <img src={imagePreview.toString()} alt="Preview" style={{ maxWidth: '15%', marginTop: "15px", marginLeft: '38%' }} />
              </Grid>
              :
              <Grid item xs={12}>
                <img src={formValue.image} alt="Preview" style={{ maxWidth: '15%', marginTop: "15px", marginLeft: '38%' }} />
              </Grid>
            }
            <TextField
              id="image"
              fullWidth
              type="file"
              {...register("image")}
              onChange={handleImageChange}
              hidden
            />
            <TextField
              label="First Name"
              {...register("first_name", { required: "First name is required" })}
              defaultValue={formValue.first_name}
              fullWidth
              margin="normal"
              error={!!errors.first_name}
              onChange={handleInputChange}
              helperText={errors.first_name?.message}
            />
            <TextField
              label="Last Name"
              {...register("last_name", { required: "Last name is required" })}
              defaultValue={formValue.last_name}
              fullWidth
              margin="normal"
              onChange={handleInputChange}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
            <TextField
              label="Gender"
              {...register("gender", { required: "Gender is required" })}
              defaultValue={formValue.gender}
              fullWidth
              margin="normal"
              onChange={handleInputChange}
              error={!!errors.gender}
              helperText={errors.gender?.message}
            />
            <TextField
              label="Date of Birth"
              type="date"
              {...register("date_of_birth", { required: "Date of birth is required" })}
              value={formValue.date_of_birth ? formValue.date_of_birth.substring(0, 10) : ''}
              fullWidth
              margin="normal"
              onChange={handleInputChange}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth?.message}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Email"
              {...register("email", { required: "Email is required" })}
              defaultValue={formValue.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <DialogActions>
              <Button onClick={handleEditClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProfileView;

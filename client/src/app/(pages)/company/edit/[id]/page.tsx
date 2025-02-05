"use client";
import { editCompany } from '@/redux/company/companySlice';
import { Button, Container, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
interface Data {
  company_id: string;
  email: string;
  company_name: string;
  description: string;
  location: {
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  user: {
    first_name: string;
    role: string;
  };
}
const defaultData: Data = {
  company_id: "",
  user: {
    first_name: "",
    role: "",
  },
  email: "",
  description: "",
  company_name: "",
  location: {
    city: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
};
const EditCompanyDetails = ({ params }: { params: { id: string } }) => {

  const [formValue, setFormValue] = useState({
    _id: "",
    user: {
      first_name: "",
      role: "",
    },
    email: "",
    description: "",
    company_name: "",
    location: {
      city: '',
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
  });
  const dispatch = useDispatch<any>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Data>();
  const router = useRouter()

  
  useEffect(() => {

    const fetchCompany = async () => {
      const storedToken = localStorage.getItem("access_token");
      const response = await axios.post("http://localhost:5100/company/view", { comapny_id: params.id }, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const fetchData = response.data;
      setFormValue(fetchData.data);
      reset(fetchData.data);
    };
    fetchCompany();
  }, [reset, params.id]);


  const onSubmit: SubmitHandler<Data> = async (data: any) => {
    dispatch(editCompany(data));
    toast.success('company edited successfully'); 
    router.push('/dashboard/company')
  //   toast.success('Company edit successfully', {
  //     onClose: () => {
  //         router.push('/dashboard/company');
  //     }
  // });
};
  const handleInputChange = (e: any) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value })
}

  return (
    <div>
      <Container component="main" maxWidth="xs" sx={{ marginBottom: "30px" }} >
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} style={{ padding: "30px 0px" }}>
              <Grid item xs={12}>
                <h3>Edit Company</h3>
                <TextField
                  required
                  fullWidth
                  id="company_name"
                  {...register("company_name")}
                  // value={formValue.company_name}
                  onChange={handleInputChange}
                  name="company_name"
                  autoComplete="company_name"
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                  required
                  fullWidth
                  id="email"
                  {...register("email")}
                  // value={formValue.email}
                  onChange={handleInputChange}
                  name="email"
                  autoComplete="email"
                />            
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  {...register("description")}
                  // value={formValue.description}
                  onChange={handleInputChange}
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  {...register("location.city")}
                  // value={formValue.location.city}
                  onChange={handleInputChange}
                  name="location.city"
                  autoComplete="city"
                />
              </Grid>          
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};
export default EditCompanyDetails;





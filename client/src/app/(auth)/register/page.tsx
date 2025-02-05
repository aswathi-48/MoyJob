"use client"
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Autocomplete, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  password: string;
  image: FileList;
  skills: string[]
}
const defaultTheme = createTheme();
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const Skills = [
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
  { title: 'Dotnet' },
  { title: 'PHP' },
  { title: 'NoSQL' },
  { title: 'Perl' },
  { title: 'Swift' },
  { title: 'Java' },
  { title: 'SQL' },
];

export default function SignUp() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();
  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("gender", data.gender);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("date_of_birth", data.date_of_birth);
      if (data.skills) {
        const skillsString = data.skills.join(', '); 
        formData.append("skills", skillsString);
    }     
     formData.append("image", data.image[0]);
      const response = await axios.post('http://localhost:5100/user/register', formData);
      console.log(response.data);
      router.push('/login');

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage("There was an error registering the user.");
      } else {
        setErrorMessage("A user with this email already exists.");
      }
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setImagePreview(file);
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  {...register("first_name", { required: "First name is required" })}
                  id="first_name"
                  label="First Name"
                  autoFocus
                  error={!!errors.first_name}
                  helperText={errors.first_name ? errors.first_name.message : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  {...register("last_name", { required: "Last name is required" })}
                  id="last_name"
                  label="Last Name"
                  autoComplete="family-name"
                  error={!!errors.last_name}
                  helperText={errors.last_name ? errors.last_name.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  {...register("email", { required: "Email is required" })}
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  {...register("password", { required: "Password is required" })}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  {...register("date_of_birth", { required: "Date of birth is required" })}
                  name="date_of_birth"
                  type="date"
                  id="date_of_birth"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date_of_birth}
                  helperText={errors.date_of_birth ? errors.date_of_birth.message : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row>
                  <FormControlLabel
                    {...register("gender", { required: "Gender is required" })}
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    {...register("gender", { required: "Gender is required" })}
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
                {errors.gender && <Typography color="error">{errors.gender.message}</Typography>}
              </Grid>
              <Stack spacing={3} sx={{ width: 500 }}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={Skills}
                        getOptionLabel={(option) => option.title}
                        defaultValue={[Skills[0]]}
                        onChange={(event, value) => {
                            setValue("skills", value.map((option) => option.title));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Skills"
                                placeholder="Favorites"
                            />
                        )}
                    />
                </Stack>
              <Grid item xs={12}>
                {imagePreview && (
                  <img src={imagePreview.toString()} alt="Preview" style={{ maxWidth: '40%', marginTop: '15px', marginLeft: '25%' }} />
                )}
                <TextField
                  required
                  fullWidth
                  type="file"
                  {...register("image", { required: "Image is required" })}
                  onChange={handleImageChange}
                  error={!!errors.image}
                  helperText={errors.image ? errors.image.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
            <Grid xs={6}>    
              <Link href='/adminRegister'> Admin Register</Link>
              </Grid>
              <Grid item xs={6}>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
             
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  ); 
}

"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import BasicCard from '@/components/job/Card';
import { addNewApplication } from '@/redux/application/applicationSlice';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css'; // Import the CSS for react-quill
import ReactQuill from 'react-quill';
// import DOMPurify from 'dompurify';

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
interface Values {
  company: {
    _id: string;
    company_name: string;
    location: {
      city: string;
    };
    cordinates: {
      lat: string;
      lng: string;
    };
  };
  job_title: string;
  job_type: string;
  posted_date: string;
  salary: number;
  createdAt: string;
  description: string;
  category: string;
  requirements: string;
  status: string;
}
interface ApplicationData {
  _id: string;
  email: string;
  name: string;
  skills: string[];
  message: string;
  cv: string,
  user: {
    userId: string
  }
}
const Page: React.FC<{ params: { id: string }, userId: string }> = ({ params, userId }) => {
  const [formValue, setFormValue] = useState<Values>({
    job_title: "",
    job_type: "",
    posted_date: "",
    salary: 0,
    createdAt: '',
    category: '',
    description: '',
    requirements: '',
    status: '',
    company: {
      _id: "",
      company_name: '',
      location: {
        city: '',
      },
      cordinates: {
        lat: '',
        lng: ''
      }
    }
  });
  const [open, setOpen] = useState(false);
  const [cv, setCv] = useState<File | null>(null);
  const [message, setMessage] = useState(''); 
  const dispatch = useDispatch<any>();
  useEffect(() => {
    const fetchJob = async () => {
      const storedToken = localStorage.getItem("access_token");
      const response = await axios.post("http://localhost:5100/job/view", { _id: params.id }, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      const fetchData = response.data;
      setFormValue(fetchData.data);
      
    }
    fetchJob();
  }, [params.id]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCv(file);
    }
  };
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ApplicationData>();
  const onSubmit = async (data: ApplicationData) => {

    // const sanitizedMessage = DOMPurify.sanitize(message);
    const strippedMessage = message.replace(/<[^>]+>/g, '');

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("message", strippedMessage); 
    formData.append("job_id", params.id);
    if (data.skills) {
      const skillsString = data.skills.join(', ');
      formData.append("skills", skillsString);
    }
    if (cv) {
      formData.append("cv", cv);
    }
    dispatch(addNewApplication(formData));
    handleClose();
  };
  const jobTypeColor = formValue.job_type === 'part-time' ? 'blue' : 'green';
  const createdAtDate = new Date(formValue.createdAt);
  const formattedDate = createdAtDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
      <Box>
      <Grid container spacing={2}>
        <Grid xs={4} sx={{
          padding: "10% 10% 17% 10%"
        }}>
        <BasicCard _id={params.id} data={formValue} />
        </Grid>
        <Grid xs={8}  >
          <Grid container spacing={2}>
        <Grid xs={7}>
        <Box sx={{ marginLeft: "60px", padding: "30% 10% 16% 10%" }}>
          <Typography variant='h6' sx={{ marginLeft: "60px", paddingTop: "20px" }}>
            Job Details
          </Typography>
          <Chip
            label={formValue.job_type}
            variant="outlined"
            sx={{ color: jobTypeColor, borderColor: jobTypeColor, width: "90px", height: "20px", marginTop: "10px", textAlign: "center", marginLeft: "65px" }}
          />
          <Typography sx={{ marginLeft: "60px", paddingTop: "10px" }}><span style={{ color: "gray" }}>Posted Date:</span> {formattedDate} </Typography>
          <Typography variant='h6' sx={{ marginLeft: "60px", paddingTop: "20px" }}>
            Location
          </Typography>
          <Typography sx={{ marginLeft: "60px", paddingTop: "10px" }}>

            {formValue.company.location.city}

          </Typography>
        </Box>
        </Grid>
        <Grid xs={5}>
        <Typography variant='h6' sx={{ marginLeft: "60px", paddingTop: "45%" }}> Requirements</Typography>
          <Chip label={formValue.requirements} sx={{
            padding: "20px",
            color: "green",
            margin: "40px",
            fontSize: "17px"
          }} />
        </Grid>
          </Grid>
          <Button sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgb(37, 87, 167)",
            width: "350px",
            textAlign: "center",
            margin: "0px 0px 5% 33%",
            background: "rgb(37, 87, 167)",
            borderRadius: "5px",
            color: "white",
            '&:hover': {
              background: "rgb(25, 70, 140)", 
              borderColor: "rgb(25, 70, 140)" 
            }}} onClick={handleClickOpen}> Apply Now </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Apply for {formValue.job_title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To apply for this job, please enter your email address and any additional information here. We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            {...register("name")}
            label="Name "
            type="name"
            fullWidth
            variant="standard"
            error={!!errors.name}
            helperText={errors.name && "Name is required"}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            {...register("email")}
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            error={!!errors.email}
            helperText={errors.email && "Email is required"}
          />
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
                  error={!!errors.skills}
                  helperText={errors.skills && "Skills are required"}
                />
              )}
            />
          </Stack>
          <ReactQuill
            value={message}
            onChange={setMessage}
            placeholder="Message"
            theme="snow"
            style={{ height: "150px", margin: "20px 0px 60px "}}
            
          />
          <TextField
            autoFocus
            margin="dense"
            type="file"
            fullWidth
            error={!!errors.cv}
            onChange={handleImageChange}
            helperText={errors.cv && "CV is required"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </DialogActions>
      </Dialog>
      </Box>
  );
}
export default Page;
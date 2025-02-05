"use client"
import { editJob } from '@/redux/job/jobSlice';
import { Autocomplete, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface Requirement {
    title: string;
}


interface Data {
    _id: string;
    company: {
        company_name: string;
        location: {
            city: string,
            coordinates: {
                lat: number,
                lng: number
            }
        };
    };
    job_title: string;
    job_type: string,
    posted_date: string;
    salary: number | string
    category: string
    description: string,
    requirements: Requirement[];
    status: string,
    interviewScheduledAt: string
}

const defaultData: Data = {
    _id: "",
    company: {
        company_name: "",
        location: {
            city: "",
            coordinates: {
                lat: 0,
                lng: 0,
            },
        },
    },
    job_title: "",
    job_type: "",
    posted_date: "",
    salary: 0,
    category: "",
    description: '',
    requirements: [],
    status: '',
    interviewScheduledAt: ''
};

const EditJobDEtails = ({ params }: { params: { id: string } }) => {

    const router = useRouter()
    const [formValue, setFormValue] = useState({
        _id: "",
        company: {
            company_name: "",
            location: {
                city: "",
                coordinates: {
                    lat: 0,
                    lng: 0,
                },
            },
        },
        job_title: "",
        job_type: "",
        posted_date: "",
        salary: 0,
        category: "",
        description: '',
        requirements: [],
        status: '',
        interviewScheduledAt: ''
    })
    
    const dispatch = useDispatch<any>()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Data>();


    useEffect(() => {

        const fetchJob = async () => {
            const storedToken = localStorage.getItem("access_token")
            const response = await axios.post("http://localhost:5100/job/view", { _id: params.id },
                //   const response = await axios.post(`${url.serverUrl}/job/view`, { _id: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }).then((res) => {
                    const fetchData = res.data
                    setFormValue(fetchData.data)
                    reset(fetchData.data);

                })
        }

        fetchJob()

    }, [reset, params.id])



    const onSubmit: SubmitHandler<Data> = async (data: any) => {
        dispatch(editJob(data));
        toast.success('Job edited successfully'); 
        router.push('/dashboard/jobs')
        // toast.success('Job edited successfully', {
        //     onClose: () => {
        //         router.push('/dashboard/jobs');
        //     }
        // });
    };



    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormValue({ ...formValue, [name]: newValue });
      };


    return (
        <Container component="main" maxWidth="xs" sx={{ marginBottom: "30px" }}>
            <div>
                <h3>Edit Job</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} style={{ padding: "30px 0px" }}>
                        <Grid item xs={12} >
                        

                            <TextField
                                required
                                fullWidth
                                id="job_title"
                                // value={formValue.job_title}
                                {...register("job_title")}
                                onChange={handleInputChange}
                                name="job_title"
                                autoComplete="job_title"
                                error={!!errors.job_title}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                required
                                fullWidth
                                id="salary"
                                // value={formValue.salary}
                                {...register("salary")}
                                onChange={handleInputChange}
                                name="salary"
                                autoComplete="salary"
                                
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    id="demo-simple-select"
                                    value={formValue.category}
                                    {...register("category")} onChange={handleInputChange}
                                >
                                    <MenuItem value={"developer"}>Developer</MenuItem>
                                    <MenuItem value={"backend-developer"}>Backend Development</MenuItem>
                                    <MenuItem value={"front-developer"}>Front Development</MenuItem>
                                    <MenuItem value={"ui/ux-developer"}>UI/UX Development</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Job Type</InputLabel>
                                <Select
                                    id="demo-simple-select"
                                    value={formValue.job_type}
                                    {...register("job_type")} onChange={handleInputChange}
                                >
                                    <MenuItem value={"part-time"}>Part Time</MenuItem>
                                    <MenuItem value={"full-time"}>Full Time</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={OurRequirements}
                            getOptionLabel={(option) => option.title}
                            defaultValue={[OurRequirements[0]]}
                            onChange={(event, value: any) => {
                                setFormValue({ ...formValue, requirements: value });
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
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formValue.status}
                                    {...register("status")} onChange={handleInputChange}
                                >
                                    <MenuItem value={"Active"}>Active</MenuItem>
                                    <MenuItem value={"InActive"}>InActive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12}>
                        <TextField
                            label="Interview Schedule"
                            type="date"
                            {...register("interviewScheduledAt", { required: "Date of birth is required" })}
                            value={formValue.interviewScheduledAt ? formValue.interviewScheduledAt.substring(0, 10) : ''}
                            fullWidth
                            margin="normal"
                            onChange={handleInputChange}
                            error={!!errors.interviewScheduledAt}
                            helperText={errors.interviewScheduledAt?.message}
                            InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>                                  
                        <TextField
                                required
                                fullWidth
                                id="description"
                                // value={formValue.job_title}
                                {...register("description")}
                                onChange={handleInputChange}
                                name="description"
                                autoComplete="description"
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
    )
}

export default EditJobDEtails


const OurRequirements   = [
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

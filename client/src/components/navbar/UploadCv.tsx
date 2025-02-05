import { addNewSkill } from '@/redux/skill/skillSlice';
import { RootState } from '@/redux/store';
import { Autocomplete, Button, Dialog, DialogActions, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

interface Skill {
    _id: string,
    skills: string[],
    cv: string,
    user: {
        userId: string,
        first_name: string,
        email: string
    }
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

const UploadCv = ({ open, handleClose, userId }: { open: any, handleClose: any, userId: string }) => {
    const { register, handleSubmit, setValue } = useForm<Skill>();
    const [cv, setCv] = useState<File | null>(null);
    const dispatch = useDispatch<any>();
    console.log(userId);
    
    const onSubmit = async (data: Skill) => {
        const formData = new FormData();
        if (data.skills) {
            const skillsString = data.skills.join(', '); 
            formData.append("skills", skillsString);
        }
        if (cv) {
            formData.append("cv", cv);
        }
        formData.append("userId", userId || '')
        console.log("Form Data: ", formData);

        dispatch(addNewSkill(formData));
        handleClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setCv(file);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <Typography>Upload your CV and skills</Typography>
            </DialogTitle>
            <DialogActions sx={{
                display: "flex",
                flexDirection: "column"
            }}>
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
                <TextField
                    autoFocus
                    margin="dense"
                    type="file"
                    fullWidth
                    onChange={handleImageChange}
                />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                </DialogActions>
            </DialogActions>
        </Dialog>
    );
};

export default UploadCv;

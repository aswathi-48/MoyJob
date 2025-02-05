import React from 'react';
import Box from '@mui/joy/Box';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Card, Chip } from '@mui/material';
import Link from 'next/link';

interface Company {
  company_name: string;
  location: {
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

interface JobData {
  _id: string;
  company?: Company;
  job_title: string;
  job_type: string;
  posted_date: string;
  salary: number;
  category: string;
  createdAt: string;
  description: string;
  requirements: string[];
  status: string;
}

interface CardVariantsProps {
  data: JobData;
}


export default function CardVariants({ data }: CardVariantsProps) {

  const createdAtDate = new Date(data.createdAt);
  const formattedDate = createdAtDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jobStatusColor = data.status === 'InActive' ? 'red' : 'green';

  return (
    <div>
      <Link href={{ pathname: `/job/view/${data._id}` }} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            width: '100%',
            // maxWidth: 990,
            display: 'grid',
            padding: '10px',
            height: '200px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            // gap: 2,
            cursor: 'pointer',
          }}
        >

          <Card sx={{ padding: '20px',  background:"#f1f1f1", }}>
            <CardContent sx={{ paddingTop: '10px' }}>
              <Chip label={formattedDate} variant="outlined" sx={{ width: '130px', marginLeft: '45px' }} />
              <Typography level="title-md" textColor="inherit" sx={{ paddingTop: '20px' }}>
                {data.job_title}
              </Typography>

              {data.company && (
                <>
                  <Typography textColor="inherit" sx={{ textAlign:"center" }}>
                    {data.company.company_name}, {data.company.location.city.split(',')[0]}
                  </Typography>
                  <Typography textColor="inherit" sx={{ }}>

                  </Typography>
                </>
              )}

              <Chip
                label={data.status}
                variant="outlined"
                sx={{ color: jobStatusColor, borderColor: jobStatusColor, width:"90px", height:"20px" , marginTop:"20px", textAlign:"center", marginLeft:"65px" }}
              />

            </CardContent>
          </Card>
        </Box>
      </Link>
    </div>
  );
}


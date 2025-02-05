import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';

import { useDispatch } from 'react-redux';
import { subscribeToCompany } from '@/redux/company/companySlice';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface Data {
  _id: string;
  data: {
    _id: string;
    company_name: string;
    email: string;
    description: string;
    location: {
      city: string;
      cordinates: {
        lat: number;
        lng: number;
      };
    };
    user: {
      userId: string;
      first_name: string;
      role: string;
    } | null;
  };
}

const CompanyViewCard = ({ data }: Data) => {
  const dispatch = useDispatch<any>();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Load subscription status from local storage on component mount
    const subscriptionStatus = localStorage.getItem(`subscription_${data._id}`);
    if (subscriptionStatus === 'true') {
      setIsSubscribed(true);
    }
  }, [data._id]);

  const handleSubscribe = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    const payload = {
      userId,
      companyId: data._id,
    };

    await dispatch(subscribeToCompany(payload));

    // Update local storage and state after successful subscription
    localStorage.setItem(`subscription_${userId}_${data._id}`, 'true');
    setIsSubscribed(true);
  };

  const [city, ...rest] = data.location.city.split(',');

  return (
    <div>
      <Box>
        <Grid container spacing={2}>
          <Grid xs={5} sx={{
            padding: "10% 15% 20% "
          }}>
          <Card sx={{ padding: "20px", width: "300px" }}>
              <CardContent sx={{ padding: "20px",}}>
                <Typography> <b> Company Name: </b> {data.company_name}</Typography>
                <Typography> <b> Contact:</b>  {data.email}</Typography>
                {/* <Typography>location: {data.location.city}</Typography> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={7} sx={{
            padding: "10% 5% 5% "
          }}>
          <Typography sx={{ color: "gray", paddingLeft: "8%"}}>location: </Typography>
          <Typography sx={{ color: "black", paddingLeft: "8%", paddingTop: "5px" }}>
            {city}
            {rest.length > 0 && (
              <>
                ,<br />
                {rest.join(',')}
              </>
            )}
    </Typography>
          <Typography sx={{ color: "black", paddingLeft: "50px", paddingTop: "20px" }}>
              <span style={{ color: "gray" }}>Description: <br /></span>
              {data.description}
            </Typography>
            <CardActions>
      <Button
        onClick={handleSubscribe}
        disabled={isSubscribed}
        startIcon={<NotificationsIcon />}
        sx={{
          backgroundColor: isSubscribed ? 'green' : '#000080',
          color: 'white',
          '&:hover': {
            backgroundColor: isSubscribed ? 'darkgreen' : 'darkblue',
          },
          marginLeft: "40%",
          width: "200px"
        }}
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </CardActions>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CompanyViewCard;
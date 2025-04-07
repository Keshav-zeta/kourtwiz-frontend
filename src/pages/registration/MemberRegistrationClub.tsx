import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Paper,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import './MemberRegistrationClubPage.css';
import { useNavigate } from 'react-router-dom';

type Club = {
  id: number;
  name: string;
  address: string;
  logoUrl: string;
};

const clubs: Club[] = [
  {
    id: 1,
    name: 'Town of Fort Mill, Revealed Pickleball/Tennis',
    address: '',
    logoUrl: 'https://via.placeholder.com/40?text=R',
  },
  {
    id: 2,
    name: 'Cotton Mill Pickleball',
    address: '510 South Spring Street, Tupelo, Mississippi, 38804',
    logoUrl: 'https://via.placeholder.com/40?text=CMP',
  },
  {
    id: 3,
    name: 'Fox Mill Woods Swim & Tennis',
    address: '2634-A Black Fir Court, Reston, VA, 20191',
    logoUrl: 'https://via.placeholder.com/40?text=FMW',
  },
  {
    id: 4,
    name: 'Mill Valley Tennis Club',
    address: '285 Manor Drive, Mill Valley, CA, 94941',
    logoUrl: 'https://via.placeholder.com/40?text=MVTC',
  },
];

const MemberRegistrationClubPage: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedClub) {
      navigate('/member-registration/signup', {
        state: {
          clubId: Math.floor(Math.random() * 100),
          clubName: selectedClub.name,
        },
      });
    }
  }, [selectedClub, navigate]);
  return (
    <div className='member-registration-wrapper'>
      <img
        src='/src/assets/kourtwiz_logo.png'
        alt='Club Logo'
        className='member-registration-logo'
      />
      <Typography variant='h5' className='member-registration-heading'>
        Find your Club
      </Typography>

      <Autocomplete
        options={clubs}
        getOptionLabel={(option) => option.name}
        noOptionsText='No clubs found'
        onChange={(event, newValue) => {
          setSelectedClub(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label='Select a club' variant='outlined' />
        )}
        renderOption={(props, option) => (
          <Paper {...props} key={option.id} className='club-option-paper'>
            <div className='club-option-content'>
              <Avatar
                src={option.logoUrl}
                alt={option.name}
                className='club-avatar'
              />
              <div className='club-details'>
                <Typography variant='subtitle1' className='club-name'>
                  {option.name}
                </Typography>
                {option.address && (
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    className='club-address'
                  >
                    {option.address}
                  </Typography>
                )}
              </div>
            </div>
            <Button
              variant='contained'
              color='success'
              size='small'
              className='create-account-button'
              onClick={() => {
                // navigate('/member-registration/signup', {
                //   state: {
                //     clubId: Math.floor(Math.random() * 100),
                //     clubName: selectedClub,
                //   },
                // });
              }}
            >
              Create Account
            </Button>
          </Paper>
        )}
        PaperComponent={({ children }) => (
          <Paper className='autocomplete-paper'>{children}</Paper>
        )}
      />
    </div>
  );
};

export default MemberRegistrationClubPage;

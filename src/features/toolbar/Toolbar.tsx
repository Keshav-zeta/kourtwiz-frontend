import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import {
  AppBar,
  Toolbar as MuiToolbar,
  Box,
  Button,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useKeycloak } from '@react-keycloak/web';
import { useUserInfo } from '../../context/UserInfoContext';
import { useNavigate } from 'react-router-dom';
import './Toolbar.css';
import { useViewportSize } from '../../shared/components/ViewportSize/useViewPortSize';
import UserProfile from '../userProfile/components/user-profile/UserProfile';
import AuthContext from '../../context/AuthContext';

type Props = {
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  handleMenu: () => void;
};

const Toolbar: React.FC<Props> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleMenu,
}) => {
  const { width } = useViewportSize();
  const { user } = useContext(AuthContext)!;
  if (!user) return <>Loading...</>;
  const selectedClubname = user?.userClubRole?.find(
    (club) => club.clubId === user?.currentActiveClubId
  ).clubName;

  const toolbarAction = () => {
    handleMenu();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='toolbar-header'>
      <AppBar className='toolbar'>
        <MuiToolbar className='toolbar__content'>
          <Typography variant='h4' color='primary'>
            Welcome to {selectedClubname}
          </Typography>
          {width < 769 && (
            <div className='toolbar___logo__container'>
              {/* <img src={LGLogoMini} /> */}
            </div>
          )}
          {width < 600 && (
            <Box
              className={
                width < 600
                  ? 'cnr-search-container__hidden'
                  : 'cnr-search-container'
              }
            >
              <p>Welcome to Kourtwiz</p>
            </Box>
          )}

          <Box className='toolbar__buttons'>
            <div>
              <Button className='user-profile-container'>
                <UserProfile />
              </Button>
            </div>
            <div
              className={`${width > 768 ? 'hamburger__btn__visible' : ''}`}
              onClick={toolbarAction}
            >
              <MenuIcon />
            </div>
          </Box>
        </MuiToolbar>
      </AppBar>
    </div>
  );
};

export default Toolbar;

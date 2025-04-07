import { useContext } from 'react';
import AuthContext from '../../../../context/AuthContext';
import './SwitchClub.css';
import {
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useMutateChangeActiveclub } from '../../../../shared/apis/clubs/useMutateChangeActiveclub';
import { toast } from 'react-toastify';
import { useMutateFetchUserData } from '../../../../shared/apis/User/useFetechUserData';

const SwitchClub = () => {
  const { user, setUser } = useContext(AuthContext)!;
  console.log('userData : ', user);
  const { mutate: getUserDataMuatate } = useMutateFetchUserData({
    onSuccessCallback: (data: any) => {
      console.log('setting user data : ', data);
      setUser(data);
    },
    onErrorCallback: () => {},
  });
  const { mutate: changeSelectedClub, status } = useMutateChangeActiveclub({
    onSuccessCallback: async () => {
      toast.success('org changed successfully!');
      getUserDataMuatate();
    },
    onErrorCallback: () => {
      toast.error('error while changing the club!');
    },
  });

  const handleClubClick = (clubId: string) => {
    console.log('Switching to club with ID:', clubId);
    changeSelectedClub({ clubId });
  };
  if (status === 'pending') return <>Changing club...</>;
  return (
    <div>
      <Divider textAlign='left'>
        <Chip label='Switch Club' color='primary' size='small' />
      </Divider>

      <List className='switch-club-list' disablePadding>
        {user?.userClubRole?.map((club: any) => {
          return (
            <ListItemButton
              key={club.clubId}
              onClick={() => handleClubClick(club.clubId)}
              className='switch-club-item'
              disableGutters
              dense
            >
              <ListItemText
                primary={
                  <div className='club-item-line'>
                    <span className='club-name'>{club.clubName}</span>
                    {club?.clubId === user?.currentActiveClubId && (
                      <span>current</span>
                    )}
                    <span className='club-role'>({club.roleName})</span>
                  </div>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};

export default SwitchClub;

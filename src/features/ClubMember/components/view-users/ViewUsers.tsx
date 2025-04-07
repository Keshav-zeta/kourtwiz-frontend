import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material';

const Viewusers = ({
  data,
  handleOpenModal,
}: {
  data: any;
  handleOpenModal: () => void;
}) => {
  if (!data) return <>Loading...</>;
  // Filter out users with the "Club Admin" role
  const filteredUsers = data.filter((user) => user.role.name !== 'ClubAdmin');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography
          variant='h4'
          gutterBottom
          align='center'
          style={{ fontWeight: 'bold', color: '#333' }}
        >
          View User's List
        </Typography>
        <Button
          variant='contained'
          color='primary'
          style={{ fontWeight: 'bold' }}
          onClick={handleOpenModal}
        >
          Add User
        </Button>
      </div>
      <TableContainer
        component={Paper}
        elevation={3}
        style={{ borderRadius: '10px', overflow: 'hidden' }}
      >
        <Table>
          <TableHead style={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Email
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Phone Number
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Role
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Tasks
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Address
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                City
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                State
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Country
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((userEntry, index) => (
              <TableRow
                key={userEntry.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                }}
              >
                <TableCell>{userEntry.user.name}</TableCell>
                <TableCell>{userEntry.user.email}</TableCell>
                <TableCell>{userEntry.user.phoneNumber || 'N/A'}</TableCell>
                <TableCell>{userEntry.role.name}</TableCell>
                <TableCell>
                  {userEntry.role.tasks.map((task) => task.taskName).join(', ')}
                </TableCell>
                <TableCell>{userEntry.user.address || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.city || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.state || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.country || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Viewusers;

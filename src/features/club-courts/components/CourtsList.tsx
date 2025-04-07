import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserInfo } from '../../../context/UserInfoContext';
import { useGetClubCourt } from '../../../shared/apis/courts/useGetClubCourts';
import { useMutateAddCourt } from '../../../shared/apis/courts/useMutateAddCourt';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AuthContext from '../../../context/AuthContext';

const CourtsList = () => {
  const { userInfo } = useUserInfo();
  
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;
  const { data: clubList, isLoading, error } = useGetClubCourt(clubId);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { mutate } = useMutateAddCourt({
    onSuccessCallback: () => {
      alert('Court added successfully!');
      setShowModal(false);
      reset();
    },
    onErrorCallback: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    console.log('booking court : ', data);
    const courtData = {
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      capacity: data.capacity,
      surface: data.surface,
      pricePerHour: parseFloat(data.pricePerHour),
      reservationIntervalMinutes: data.interval,
    };
    mutate({ clubId, courtData });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Courts List</h3>
      <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
        Add New Court
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Surface</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Price/Hour</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {clubList?.map((court) => (
              <TableRow key={court.id}>
                <TableCell>{court.name}</TableCell>
                <TableCell>{court.type}</TableCell>
                <TableCell>{court.surface}</TableCell>
                <TableCell>{court.capacity}</TableCell>
                <TableCell>${court.pricePerHour}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Add New Court</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField {...register('name', { required: true })} label="Name" fullWidth margin="dense" />
            <TextField {...register('type', { required: true })} select label="Type" fullWidth margin="dense">
              <MenuItem value="Singles">Singles</MenuItem>
              <MenuItem value="Doubles">Doubles</MenuItem>
              <MenuItem value="Singles & Doubles">Singles & Doubles</MenuItem>
            </TextField>
            <TextField {...register('capacity', { required: true })} label="Capacity" type="number" fullWidth margin="dense" inputProps={{ min: 0 }} />
            <TextField {...register('surface', { required: true })} label="Surface" fullWidth margin="dense" />
            <TextField {...register('pricePerHour', { required: true })} label="Price per Hour" type="number" fullWidth margin="dense" inputProps={{ min: 0 }}/>
            <TextField {...register('interval', { required: true })} select label="interval" fullWidth margin="dense">
              <MenuItem value="30">30 minutes</MenuItem>
              <MenuItem value="60">60 minutes</MenuItem>
            </TextField>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CourtsList;

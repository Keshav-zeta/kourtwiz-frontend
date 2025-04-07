import axios from 'axios';

export const fetchBookings = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken');
  const response = await axios.get(`http://44.216.113.234:8080/api/bookings/all-bookings/${clubId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const { courtBooking, openPlaySession } = response.data;


  const formatDateTime = (dateArray: number[], timeArray?: number[]) => {
    const [year, month, day] = dateArray; 
    const [hour, minute] = timeArray ?? [0, 0]; 
    return new Date(year, month - 1, day, hour, minute);
  };


  const courtEvents = courtBooking.map((booking: any) => ({
    id: booking.id,
    title: 'Reserved',
    start: formatDateTime(booking.date, booking.startTime),
    end: formatDateTime(booking.date, booking.endTime),
    resourceId: booking.courtId,
  }));

  const openPlayEvents = openPlaySession.map((session: any) => {
    const start = formatDateTime(session.startTime.slice(0, 3), session.startTime.slice(3)); 
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + session.durationMinutes);
    return {
        id: session.id,
        title: "Open Play",
        start,
        end,
        resourceId: session.courtId,
        extendedProps: {
            skillLevel: session.skillLevel,
            slotsRemaining: session.maxPlayers - (session.registeredPlayers ? session.registeredPlayers.length : 0),
            totalSlots: session.maxPlayers,  
            openSessionFull: session.openSessionFull, 
        } 
    };
  });

  return [...courtEvents, ...openPlayEvents];
};

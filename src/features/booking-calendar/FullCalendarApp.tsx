import { useState, useEffect, JSX, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import Modal from "../../features/bookings/components/Modal";
import './Calendar.css';

import 'react-calendar/dist/Calendar.css';
import AuthContext from '../../context/AuthContext';
import { fetchCourts } from './api/getCourts';
import { fetchBookings } from './api/getbookings';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useBookCourt } from '../bookings/api/useBookCourt';

function FullCalendarApp(): JSX.Element {
    const { user } = useContext(AuthContext)!;
    const clubId = user?.currentActiveClubId;
    const userId = user?.userId;
    const [courtsResponse, setCourtsResponse] = useState<{ id: string; name: string }[]>([]);
    const [courtsLoading, setCourtsLoading] = useState(true);
    const [courtsError, setCourtsError] = useState('');
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [eventsError, setEventsError] = useState('');
    const [selectedCourt, setSelectedCourt] = useState<any>(null);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [bookingDuration, setBookingDuration] = useState<number>(30);

    const generateEmptySlots = (bookings) => {
        const emptySlots = [];
    

        const startTime = new Date(selectedDate);
        startTime.setHours(9, 0, 0, 0); 
    
        const endTime = new Date(selectedDate);
        endTime.setHours(23, 0, 0, 0); 
    
        courtsResponse.forEach((court) => {
            let currentTime = new Date(startTime);
    
            while (currentTime < endTime) {
                const nextTime = new Date(currentTime);
                nextTime.setMinutes(nextTime.getMinutes() + 30); 
    
                const isSlotOccupied = bookings.some(
                    (event) =>
                        event.resourceId === court.id &&
                        new Date(event.start) < nextTime &&
                        new Date(event.end) > currentTime
                );
    
                if (!isSlotOccupied) {
                    emptySlots.push({
                        id: `empty-${court.id}-${currentTime.getTime()}`,
                        title: "Reserve",
                        start: new Date(currentTime),
                        end: new Date(nextTime),
                        resourceId: court.id,
                        extendedProps: { isTemporary: true,resourceId: court.id },
                    });
                }
    
                currentTime = nextTime;
            }
        });
    
        return emptySlots;
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleOpenModal = (event) => {
      setSelectedEvent(event);
      const court = courtsResponse.find((c) => c.id === event.extendedProps.resourceId);
      setSelectedCourt(court);
      setIsModalOpen(true);
     };
  
    
        const handleCloseModal = () => {
            setIsModalOpen(false);
            setSelectedCourt(null);
        };
        const { bookCourt, bookingLoading } = useBookCourt(() => {
            handleCloseModal();
            loadBookings();
        });

        const handleConfirmBooking = () => {
          const startTimeEvent = new Date(selectedEvent.start);
          const endTimeEvent = new Date(startTimeEvent.getTime() + bookingDuration * 60 * 1000);
          const resourceId = selectedEvent.extendedProps?.resourceId;
          const formatTime = (date: Date) =>
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
          const formattedStartTime = formatTime(startTimeEvent);
          const formattedEndTime = formatTime(endTimeEvent);
      
          bookCourt({
              userId,
              clubId,
              courtId: resourceId,
              date: new Date(selectedEvent.start).toISOString().split("T")[0],
              startTime: formattedStartTime,
              endTime: formattedEndTime,
              participants: [userId]
     });
      };
      
        
    const handleReserveOrWaitlist = async (sessionId: string, isFull: boolean) => {
        const token=localStorage.getItem('jwtToken');
        try {
            const response = await axios.post(
                `http://44.216.113.234:8080/api/openplay/bookings`,
                null,
                {
                    headers: {

                        Authorization: `Bearer ${token}`,

                    },
                    params: {
                        sessionId,
                        userId,
                        isGuest: false,
                    },
                }
            );

            if (response.status === 200) {
                toast.success(isFull ? 'You have been added to the waitlist!' : 'Court reserved successfully!');
                loadBookings();
            } else {
                toast.error('Failed to process your request. Please try again.');
            }
        } catch (error) {
            let errorMessage = "Failed to process your request. Please try again.";

            if (error.response) {
                if (error.response.data?.message) {
                    errorMessage = error.response.data.message;  
                } else if (error.response.data) {
                    errorMessage = JSON.stringify(error.response.data); 
                }
            }
            toast.error(errorMessage);
        }
    };
    
    const renderEventContent = (arg) => {
        const { event } = arg;
        if (event.extendedProps?.isTemporary) {
            return (
                <button
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid #ccc',
                        padding: '5px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        width: "100%", 
                        height: "100%", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center"
                    }}
                    onClick={() => {
                        handleOpenModal(event)
                    }}
                >
                    Reserve
                </button>
            );
        }
        const isCourtBooking = event.title === 'Reserved'; 
        const isFull = event.extendedProps.slotsRemaining==0;
        let backgroundColor = '#FDFD96'; 
        if (isCourtBooking) {
            backgroundColor = '#575755'; 
        } else if (isFull) {
            backgroundColor = '#87CEEB'; 
        }
        return (
            <div
                style={{
                fontSize: '14px',
                padding: '5px',
                height: '100%',
                whiteSpace: 'normal',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor, 
                color: isCourtBooking ? 'white' : 'black', 
                borderRadius: '4px',
                }}
            >
                {isCourtBooking ? (
                <p style={{ fontWeight: 'bold', margin: 0 }}>Reserved</p>
                ) : (
                <>
                    
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{event.extendedProps.skillLevel} - OPEN PLAY</p>
        
    
                    <p style={{ margin: 0 }}>
                    {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
        
                    
                    {isFull ? (
                    <p style={{ backgroundColor: 'red', color: 'white', padding: '1px', borderRadius: '4px', margin: 0 }}>
                        FULL
                    </p>
                    ) : (
                    <p style={{ margin: 0 }}>
                        {event.extendedProps?.slotsRemaining} of {event.extendedProps.totalSlots} slots left
                    </p>
                    )}
        
                    
                    <button
                    style={{
                        marginTop: '5px',
                        padding: '5px 10px',
                        backgroundColor: isFull ? 'gray' : 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleReserveOrWaitlist(event.id, isFull)}
                    >
                    {isFull ? 'Join Waitlist' : 'Join OPEN Play'}
                    </button>
                </>
                )}
            </div>
        );
    };
  
    useEffect(() => {
        const loadCourts = async () => {
          try {
            setCourtsLoading(true);
            const courts = await fetchCourts(clubId!);
            setCourtsResponse(courts);
          } catch (error) {
            setCourtsError(error.message);
          } finally {
            setCourtsLoading(false);
          }
        };
    
        if (clubId) loadCourts();
      }, [clubId]);

      const loadBookings = async () => {
        try {
            const bookings = await fetchBookings(clubId!);
            const emptySlots = generateEmptySlots(bookings);
            setEvents([...bookings, ...emptySlots]); 
        } catch (error) {
            setEventsError(error.message);
        }
    };

    useEffect(() => {
        if (clubId) loadBookings();
    }, [clubId,selectedDate]);

    const handleDateChange = (info) => {
        setSelectedDate(new Date(info.start)); 
    };


  return (
    <div className="App">
      <div className="full-calendar">
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <FullCalendar
          key={selectedDate.toISOString()}
          height="auto"
          initialDate={selectedDate}
          plugins= {[ resourceTimeGridPlugin ]}
  initialView='resourceTimeGridDay'
          slotMinTime="09:00:00"
            slotMaxTime="23:00:00"
            
        resources={courtsResponse}
          events={events}
          resourceAreaHeaderContent="Courts"
          eventBackgroundColor="#b3cde0"
          eventTextColor="#0f2657"
          nowIndicator
          eventContent={renderEventContent}
          datesSet={handleDateChange}
        />
      </div>
      {/* <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="calendar"
        />
      </div> */}
     {isModalOpen && selectedEvent && (
        <Modal onClose={handleCloseModal}>
          <h3>Book {selectedCourt?.name}</h3>
          <p>
            Date: <strong>{new Date(selectedEvent.start).toDateString()}</strong><br />
            Start Time: <strong>{new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          </p>
          <label>
            Select Duration:
            <select
              value={bookingDuration}
              onChange={(e) => setBookingDuration(Number(e.target.value))}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </label>
          <br />
          <button onClick={handleConfirmBooking} disabled={bookingLoading} className='booking-button'>
            {bookingLoading ? "Booking..." : `Book for ${bookingDuration} minutes`}
          </button>
        </Modal>
      )}
  </div>

  );
}

export default FullCalendarApp;

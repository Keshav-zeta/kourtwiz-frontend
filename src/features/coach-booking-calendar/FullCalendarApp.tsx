import { useState, useEffect, JSX, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import Modal from "../../features/bookings/components/Modal";
import './Calendar.css';

import 'react-calendar/dist/Calendar.css';
import AuthContext from '../../context/AuthContext';
import { fetchCoaches } from './api/getCoaches';
import { fetchCoachBookings } from './api/getCoachBookings';
import { useBookCoach } from './api/useBookCoach';

function FullCalendarApp(): JSX.Element {
    const { user } = useContext(AuthContext)!;
    const clubId = user?.currentActiveClubId;
    const userId = user?.userId;
    const [coachesResponse, setCoachesResponse] = useState<{ id: string; name: string }[]>([]);
    const [coachesLoading, setCoachesLoading] = useState(true);
    const [coachesError, setCoachesError] = useState('');
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [eventsError, setEventsError] = useState('');
    const [selectedCoach, setSelectedCoach] = useState<any>(null);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [bookingDuration, setBookingDuration] = useState<number>(30);

    const generateEmptySlots = (bookings) => {
        const emptySlots = [];
    

        const startTime = new Date(selectedDate);
        startTime.setHours(9, 0, 0, 0); 
    
        const endTime = new Date(selectedDate);
        endTime.setHours(23, 0, 0, 0); 
    
        coachesResponse.forEach((coach) => {
            let currentTime = new Date(startTime);
    
            while (currentTime < endTime) {
                const nextTime = new Date(currentTime);
                nextTime.setMinutes(nextTime.getMinutes() + 30); 
    
                const isSlotOccupied = bookings.some((event) => {
        
                    return (
                      event.resourceId === coach.id &&
                      new Date(event.start) < nextTime &&
                      new Date(event.end) > currentTime
                    );
                  });
                if (!isSlotOccupied) {
                    emptySlots.push({
                        id: `empty-${coach.id}-${currentTime.getTime()}`,
                        title: "Reserve",
                        start: new Date(currentTime),
                        end: new Date(nextTime),
                        resourceId: coach.id,
                        extendedProps: { isTemporary: true,resourceId: coach.id },
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
      const coach = coachesResponse.find((c) => c.id === event.extendedProps.resourceId);
      setSelectedCoach(coach);
      setIsModalOpen(true);
     };
  
    
        const handleCloseModal = () => {
            setIsModalOpen(false);
            setSelectedCoach(null);
        };
        const { bookCoach, bookingLoading } = useBookCoach(() => {
            handleCloseModal();
            loadBookings();
        });

        const handleConfirmBooking = () => {
          const startTimeEvent = new Date(selectedEvent.start);
          const endTimeEvent = new Date(startTimeEvent.getTime() + bookingDuration * 60 * 1000);
          const resourceId = selectedEvent.extendedProps?.resourceId;
          const formatTime = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
          
            return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
          };
          console.log
          const formattedStartTime = formatTime(startTimeEvent);
          const formattedEndTime = formatTime(endTimeEvent);
          // console.log(new Date(selectedEvent.start).toISOString().split("T")[0], "date")
          // console.log(formattedStartTime)
          // console.log(formattedEndTime)
          
      
          bookCoach({
              userId,
              coachId: resourceId,
              date: new Date(selectedEvent.start).toISOString().split("T")[0],
              startTime: formattedStartTime,
              endTime: formattedEndTime,
     });
      };
    
    const renderEventContent = (arg) => {
        const { event } = arg;
        // console.log(event)
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
        const isCoachBooking = event.title === 'Reserved'; 
        const isFull = event.extendedProps.slotsRemaining==0;
        let backgroundColor = 'grey'; 
        if (isCoachBooking) {
            backgroundColor = 'red'; 
        } else if (isFull) {
            backgroundColor = 'blue'; 
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
                color: isCoachBooking ? 'white' : 'black', 
                borderRadius: '4px',
                }}
            >
                {isCoachBooking ? (
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
                    // onClick={() => handleReserveOrWaitlist(event.id, isFull)}
                    >
                    {isFull ? 'Join Waitlist' : 'Join OPEN Play'}
                    </button>
                </>
                )}
            </div>
        );
    };
  
    useEffect(() => {
        const loadCoaches = async () => {
          try {
            setCoachesLoading(true);
            const coaches = (await fetchCoaches(clubId!)).map((coach: any) => ({
              id: coach.id,
              title: coach.name
            }));           
            setCoachesResponse(coaches);
          } catch (error) {
            setCoachesError(error.message);
          } finally {
            setCoachesLoading(false);
          }
        };
    
        if (clubId) loadCoaches();
      }, [clubId]);

      const loadBookings = async () => {
        try {
            const bookings = await fetchCoachBookings(clubId!);

            const emptySlots = generateEmptySlots(bookings);
            // console.log(bookings, "bookings")

            // console.log(emptySlots, "empty")
            setEvents([...bookings, ...emptySlots]); 
        } catch (error) {
            setEventsError(error.message);
        }
    };

    useEffect(() => {
        if (clubId){ 
            loadBookings()
        };
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
            
        resources={coachesResponse}
          events={events}
          resourceAreaHeaderContent="Coaches"
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
          <h3>Book {selectedCoach?.name}</h3>
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

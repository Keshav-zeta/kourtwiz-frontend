import { useContext, useState, useEffect, useMemo } from "react";
import AuthContext from "../../context/AuthContext";
import { useGetPreviousBookings } from "../../features/bookings/api/useGetUserPreviousBookings";
import { useBookCourt } from "../../features/bookings/api/useBookCourt";
import Modal from "../../features/bookings/components/Modal";
import "./BookingsPage.css";
import { useGetCourts } from "../../features/bookings/api/useGetCourts";
import { useGetCourtDetails } from "../../features/bookings/api/useGetCourtDetails";

const BookingsPage = () => {
    const { user } = useContext(AuthContext)!;

    if (!user) {
        return <p>Loading...</p>;
    }

    const userId = user?.userId ?? "";
    const clubIds = user?.userClubRole?.map((role) => role.clubId) ?? [];
    const clubNames = user?.userClubRole?.map((name) => name.clubName) ?? [];

    const [courtsData, setCourtsData] = useState([]);

    const courtsResponses = clubIds.map((clubId) => useGetCourts(clubId));

    const courtsLoading = courtsResponses.some((res) => res.isLoading);
    const courtsError = courtsResponses.find((res) => res.error)?.error;

    useEffect(() => {
        const newMergedCourts = courtsResponses.flatMap((res, index) =>
            (res.data || []).map((court) => ({
                ...court,
                clubId: clubIds[index], 
            }))
        );
    
        if (JSON.stringify(courtsData) !== JSON.stringify(newMergedCourts)) {
            setCourtsData(newMergedCourts);
        }
    }, [JSON.stringify(courtsResponses.map((res) => res.data))]);
    

    const { data: previousBookings, isLoading: bookingsLoading, error: bookingsError, refetch } = useGetPreviousBookings(userId);

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("11:00");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (court) => {
        const clubId = clubIds.find((clubId, index) =>
            (courtsResponses[index].data || []).some((c) => c.id === court.id)
        );
    
        setSelectedCourt({ ...court, clubId });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourt(null);
    };

    const { bookCourt, bookingLoading } = useBookCourt(() => {
        handleCloseModal();
        refetch();
    });

    const { data: bookedTimes } = useGetCourtDetails(selectedCourt?.id || "");

    const convertTo24HourFormat = (time) => {
        if (!time) return "00:00"; 
        const [hour, minutePart] = time.split(":");
        const [minute, period] = minutePart.split(" ");
        let hours = parseInt(hour, 10);

        if (period === "PM" && hours !== 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minute}`;
    };
    const getUnavailableTimes = () => {
        if (!bookedTimes) return [];
        return bookedTimes.map((booking) => ({
            start: booking.startTime,
            end: booking.endTime,
        }));
    };

    const unavailableTimes = getUnavailableTimes();

    const formatHour = (timeArray) => {
        if (!Array.isArray(timeArray) || timeArray.length < 1) return "";
        return timeArray[0].toString().padStart(2, "0");
    };
    const generateTimeSlots = (openingTime, closingTime, unavailableTimes) => {
        const slots = [];

        let currentTime = parseInt(openingTime.split(":")[0], 10);
        const endTime = parseInt(closingTime.split(":")[0], 10);

        while (currentTime < endTime) {
            const slotStart = `${currentTime}`;
            const slotEnd = `${currentTime + 1}`;

            const isUnavailable = unavailableTimes.some((time) => {
                const formattedStart = formatHour(time.start);
                const formattedEnd = formatHour(time.end);

                return formattedStart <= slotStart && formattedEnd > slotStart;
            });

            slots.push({ label: `${slotStart} - ${slotEnd}`, value: `${slotStart}-${slotEnd}`, disabled: isUnavailable });
            currentTime++;
        }

        return slots;
    };



    const availableTimeSlots = useMemo(() => {
        const openingTime24 = convertTo24HourFormat(selectedCourt?.openingTime || "08:00 AM");
        const closingTime24 = convertTo24HourFormat(selectedCourt?.closingTime || "10:00 PM");

        return generateTimeSlots(openingTime24, closingTime24, unavailableTimes);
    }, [selectedCourt, unavailableTimes]);

    const handleConfirmBooking = () => {
        if (!selectedCourt) return;

        const bookingData = {
            userId,
            clubId: selectedCourt.clubId,
            courtId: selectedCourt.id,
            date: new Date().toISOString().split("T")[0],
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
            participants: [userId],
        };

        bookCourt(bookingData);
    };

    console.log(courtsData)

    return (
        <div className="BookingsPage">
            <h2>View Courts</h2>
            <div className="table-container">
                {courtsLoading ? (
                    <p>Loading courts...</p>
                ) : courtsError ? (
                    <p>Error loading courts: {courtsError.message}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                            <th>Club Name</th>
                                <th>Court Name</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Surface</th>
                                <th>Price Per Hour</th>
                                <th>Opening Time</th>
                                <th>Closing Time</th>
                                <th>Indoor</th>
                                <th>Available</th>
                                <th>Blocked Dates</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courtsData.map((court) => (
                                <tr key={court.id}>
                                    <td>{clubNames[clubIds.indexOf(court.clubId)] || "Unknown Club"}</td>
                                    <td>{court.name}</td>
                                    <td>{court.location}</td>
                                    <td>{court.type}</td>
                                    <td>{court.capacity}</td>
                                    <td>{court.surface}</td>
                                    <td>${court.pricePerHour}</td>
                                    <td>{court.openingTime}</td>
                                    <td>{court.closingTime}</td>
                                    <td>{court.indoor ? "Yes" : "No"}</td>
                                    <td>{court.available ? "Yes" : "No"}</td>
                                    <td>{court.blockedDates.join(", ")}</td>
                                    <td>
                                        <button
                                            onClick={() => handleOpenModal(court)}
                                            disabled={!court.available || bookingLoading}
                                        >
                                            {bookingLoading ? "Booking..." : "Book"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <h2>Previous Bookings</h2>
            <div className="table-container">
                {bookingsLoading ? (
                    <p>Loading previous bookings...</p>
                ) : bookingsError ? (
                    <p>Error loading previous bookings: {bookingsError.message}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Club ID</th>
                                <th>Court</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previousBookings?.length > 0 ? (
                                previousBookings.map((booking) => {
                                    const courtName =
                                        courtsData.find((court) => court.id === booking.courtId)?.name || "Unknown Court";
                                    const formatTime = (time) => {
                                        if (!Array.isArray(time) || time.length < 2) return "Invalid Time"; // Ensure valid format

                                        const [hour, minute] = time.map(num => String(num).padStart(2, "0")); // Convert to "HH:MM"

                                        return `${hour}:${minute}`;
                                    };


                                    return (
                                        <tr key={booking.id}>
                                            <td>{booking.clubId}</td>
                                            <td>{courtName}</td>
                                            <td>{booking.date}</td>
                                            <td>{formatTime(booking.startTime)}</td>
                                            <td>{formatTime(booking.endTime)}</td>
                                            <td>{booking.participants.join(", ")}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">No previous bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>


            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <h3>Book {selectedCourt?.name}</h3>
                    <label>
                        Select Time:
                        <select
                            value={`${startTime}-${endTime}`}
                            onChange={(e) => {
                                const [start, end] = e.target.value.split("-");
                                setStartTime(start);
                                setEndTime(end);
                            }}
                        >
                            {availableTimeSlots.map(({ label, value, disabled }) => (
                                <option key={value} value={value} disabled={disabled}>
                                    {label} {disabled ? "(Unavailable)" : ""}
                                </option>
                            ))}
                        </select>
                    </label>
                    <p>
                        Unavailable Times:{" "}
                        {unavailableTimes
                            .map(({ start, end }) =>
                                `${start[0]}:${start[1].toString().padStart(2, "0")} - ${end[0]}:${end[1].toString().padStart(2, "0")}`
                            )
                            .join(", ")}
                    </p>
                    <button onClick={handleConfirmBooking} disabled={bookingLoading}>
                        {bookingLoading ? "Booking..." : "Confirm Booking"}
                    </button>
                </Modal>
            )}

        </div>
    );
};

export default BookingsPage;

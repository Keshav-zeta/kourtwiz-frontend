import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import "./ClubSchedule.css"
import { useGetClubBookings } from "../../features/ClubBookings/api/useGetClubBookings";
import { useGetCourts } from "../../features/bookings/api/useGetCourts";


const ClubSchedulePage = () => {
    const { user } = useContext(AuthContext)!;

    if (!user) {
        return <p>Loading...</p>;
    }

    const clubId = user?.userClubRole?.[0]?.clubId ?? "";


    const { data: clubBookingData, isLoading: isLoading, error: isError } = useGetClubBookings(clubId);
    const { data: courtsData } = useGetCourts(clubId);


    return (
        <div className="ClubSchedulePage">
            <h2>Club Bookings</h2>
            <div className="table-container">
                {isLoading ? (
                    <p>Loading bookings...</p>
                ) : isError ? (
                    <p>Error loading bookings: {error.message}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Court</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Participants</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clubBookingData?.length > 0 ? (
                                clubBookingData.map((booking) => {
                                    const courtName = courtsData?.find((court) => court.id === booking.courtId)?.name || "Unknown Court";
                                    console.log(booking.startTime)
                                    return (
                                        <tr key={booking.id}>
                                            <td>{courtName}</td>
                                            <td>{`${booking.date[1]}-${booking.date[2]}-${booking.date[0]}`}</td>
                                            <td>{`${booking.startTime[0]}:${String(booking.startTime[1]).padStart(2, "0")}`}</td>
                                            <td>{`${booking.endTime[0]}:${String(booking.endTime[1]).padStart(2, "0")}`}</td>
                                            <td>{booking.participants.join(", ")}</td>
                                            <td>{booking.status}</td>
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
        </div>
    );
};

export default ClubSchedulePage;

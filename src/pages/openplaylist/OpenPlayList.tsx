import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { fetchCourts } from "../../features/booking-calendar/api/getCourts";
import { toast } from "react-toastify";
import "./OpenPlayList.css";

const OpenPlayList = () => {
  const { user } = useContext(AuthContext)!; 
  const clubId = user?.currentActiveClubId;
  const userId = user?.userId; 

  const [sessions, setSessions] = useState([]);
  const [courts, setCourts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clubId) {
      fetchAvailableSessions();
      fetchCourtsList();
    }
  }, [clubId]);

  const fetchAvailableSessions = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `http://44.216.113.234:8080/api/openplay/sessions/available?clubId=${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessions(response.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const fetchCourtsList = async () => {
    try {
      if (!clubId) return;
      const courtsData = await fetchCourts(clubId);
      const courtMap = courtsData.reduce((acc: { [key: string]: string }, court: { id: string; title: string }) => {
        acc[court.id] = court.title;
        return acc;
      }, {});
      setCourts(courtMap);
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  const handleReserveOrWaitlist = async (sessionId: string, isFull: boolean) => {
    const token = localStorage.getItem("jwtToken");

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

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
        toast.success(isFull ? "You have been added to the waitlist!" : "Court reserved successfully!");
        fetchAvailableSessions();
      } else {
        toast.error("Failed to process your request. Please try again.");
      }
    } catch (error) {
      let errorMessage = "Failed to process your request. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || JSON.stringify(error.response.data);
      }
      toast.error(errorMessage);
    }
  };

  const formatDateTime = (startTime: number[]) => {
    const [year, month, day, hour, minute] = startTime;
    const date = new Date(year, month - 1, day, hour, minute);

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="openPlayListPage">
      <h2>Open Play Sessions</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>Duration (mins)</th>
              <th>Skill Level</th>
              <th>Court</th>
              <th>Max Slots</th>
              <th>Filled Slots</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const { date, time } = formatDateTime(session.startTime);
              const filledSlots = session.registeredPlayers.length;
              const isFull = filledSlots >= session.maxPlayers;
              const courtName = courts[session.courtId] || "Unknown Court";

              return (
                <tr key={session.id}>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{session.durationMinutes}</td>
                  <td>{session.skillLevel}</td>
                  <td>{courtName}</td>
                  <td>{session.maxPlayers}</td>
                  <td>{filledSlots}</td>
                  <td>
                    <button
                      className={isFull ? "waitlist-btn" : "join-btn"}
                      onClick={() => handleReserveOrWaitlist(session.id, isFull)}
                    >
                      {isFull ? "Join Waitlist" : "Join Open Play"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenPlayList;

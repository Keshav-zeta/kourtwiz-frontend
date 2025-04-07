import { useContext } from "react";
import "./WaitList.css";
import AuthContext from "../../context/AuthContext";
import {useGetWaitlist} from "../../features/waitlist/api/useGetWaitlist"

const ClubParticipantsTable = () => {
    const { user } = useContext(AuthContext)!;
    const userId = user?.userId;

    if (!user) {
        return <p>Loading...</p>;
    }


    const { data: WaitlistData, isLoading: isLoading, error: isError } = useGetWaitlist(userId);

  return (
    <div className="ClubSchedulePage">
      <h2>My Waitlist</h2>
      <div className="table-container">
        {WaitlistData?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Court </th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration(minutes)</th>
                <th>Skill Level</th>
              </tr>
            </thead>
            <tbody>
              {WaitlistData.map((participant) => {
                const dateResponse=participant.startTime;
                const date=dateResponse[0]+"-"+dateResponse[1]+'-'+dateResponse[2];
                const time=dateResponse[3]+':'+dateResponse[4];
                return(
                <tr key={participant.courtName}>
                  <td>{participant.courtName}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{participant.durationMinutes}</td>
                  <td>{participant.skillLevel}</td>
                </tr>
              )})}
            </tbody>
          </table>
        ) : (
          <p>No participants found.</p>
        )}
      </div>
    </div>
  );
};

export default ClubParticipantsTable;

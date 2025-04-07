import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ClubMembersPage.css";

const ClubMembersPage = () => {
  const { clubId } = useParams();
  const { state } = useLocation();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(`http://44.216.113.234:8080/user-organization-roles/organization/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedMembers = response.data.sort((a, b) => {
        if (a.role.name === "Club Admin") return -1;
        if (b.role.name === "Club Admin") return 1;
        return 0;
      });
  
      setMembers(sortedMembers);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  return (
    <div className="clubMembersPage">
      <h2>Members of {state?.clubName || "Club"}</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.user.name}</td>
                <td>{member.user.email}</td>
                <td>{member.role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubMembersPage;

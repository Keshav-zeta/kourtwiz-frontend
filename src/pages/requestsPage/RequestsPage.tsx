import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import './RequestsPage.css';

const RequestsPage = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get("http://44.216.113.234:8080/temp-clubs");
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const approveClub = async (id) => {
    try {
        const token = localStorage.getItem("jwtToken");
        await axios.put(
          `http://44.216.113.234:8080/organizations/${id}/approveOrganization`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
              "Club approved successfully!",
              {
                position: "top-right",
                autoClose: 4000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              }
            );
      fetchClubs();
    } catch (error) {
      console.error("Error approving club:", error);
    }
  };

  return (
    <div className="RequestsPage">
        <h2>Pending Approvals</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Address</th>
              <th>URL</th>
              <th>Owner Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>{club.address}</td>
                <td>
                  <a href={club.url} target="_blank">
                    {club.url}
                  </a>
                </td>
                <td>{club.ownerName}</td>
                <td>{club.ownerPhoneNumber}</td>
                <td>{club.ownerEmail}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => approveClub(club.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
            {clubs.length === 0 && (
              <p>No pending approvals</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsPage;

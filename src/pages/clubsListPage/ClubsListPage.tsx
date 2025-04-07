import axios from 'axios';
import { useEffect, useState } from 'react';
import './ClubsListPage.css';
import { useNavigate } from 'react-router-dom';
const ClubsListPage = () => {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubs();
  }, []);
  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        'http://44.216.113.234:8080/organizations',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleViewMembers = (club) => {
    navigate(`/clubs/members/${club.id}`, {
      state: { clubName: club.name, clubId: club.id },
    });
  };

  return (
    <div className='clubsListPage'>
      <h2>List of Clubs</h2>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Club Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>
                  <button
                    className='approve-btn'
                    onClick={() => handleViewMembers(club)}
                  >
                    View Members
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubsListPage;

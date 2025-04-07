import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ClubLandingPage.css';
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';
import { useGetmembershipsByClubId } from '../../shared/apis/memberships/useGetmembershipsByClubId';

const PERKS_LABELS: Record<string, string> = {
  advanceBookingDays: 'Advance Booking (Days)',
  openPlaySessionsAllowed: 'Open Play Sessions',
  tournamentAccess: 'Tournament Access',
  guestPasses: 'Guest Passes',
  coachingSessions: 'Coaching Sessions',
};

const ClubLandingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const clubName = location.state?.clubName || 'Unknown Club';
  const bgColor = location.state?.bgColor || '#f5f5f5';
  const clubImage = location.state?.clubImage || '';
  const description = location.state?.description || 'Welcome to our club!';
  
  const { data: clubMembershipdata = [], isLoading } = useGetmembershipsByClubId(
    id ?? ''
  );

  const perkLabels = {
    advanceBookingDays: 'Advance Booking Days',
    openPlaySessionsAllowed: 'Open Play Sessions Allowed',
    tournamentAccess: 'Tournament Access',
    guestPasses: 'Guest Passes',
    coachingSessions: 'Coaching Sessions',
  };

  const handleSelectPlan = (membershipId: string) => {
    navigate('/member-registration/signup', {
      state: {
        clubId: id,
        membershipId,
        clubName,
      },
    });
  };

  return (
    <>
      <div className="button-group">
        <p>{clubName}</p>
        <button className="btn" onClick={() => navigate('/home')}>
          Login
        </button>
        <button
          className="btn"
          onClick={() => navigate(`/clubs/${id}/authentication`, { state: { clubName } })}
        >
          Authenticate
        </button>
      </div>

      <div className="club-landing" style={{ backgroundColor: bgColor }}>
        <div
          className="club-container"
          style={{ backgroundImage: clubImage ? `url(${clubImage})` : 'none' }}
        >
          <h1>Welcome to {clubName}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="membership-types">
        <h2>Choose a Membership Plan</h2>

        {isLoading ? (
          <p>Loading memberships...</p>
        ) : (
          <div className="membership-cards">
            {clubMembershipdata.map((membership) => (
              <div key={membership.id} className="membership-card">
                <h3>{membership.membershipName}</h3>
                <p>Duration: {membership.duration} days</p>
                <p>Price: ${membership.price}</p>

                <h4>Perks:</h4>
                <ul>
                  {Object.entries(PERKS_LABELS).map(([key, label]) => {
                    const value = membership.perks?.[key];
                    return value ? ( 
                      <li key={key}>{label}: {value}</li>
                    ) : null;
                  })}
                </ul>

                {membership.customPerks?.length > 0 && (
                  <>
                    <h4>Custom Perks:</h4>
                    <ul>
                      {membership.customPerks.map((custom, idx) => (
                        <li key={idx}>
                          {custom.name}: {custom.value}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <button className="btn" onClick={() => handleSelectPlan(membership.id)}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ClubLandingPage;

import './Landing.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/header/Header';
import pickleball1 from '../../assets/pickleball1.jpg';
import pickleball2 from '../../assets/pickleball2.jpg';
import Footer from './components/header/Footer/Footer';
import { fetchClubs } from './api/useGetclubsListService';


const Landing = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const clubsRef = useRef(null);
  

  useEffect(() => {
    const getClubs = async () => {
      try {
        const data = await fetchClubs();
        setClubs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    getClubs();
  }, []);
  



  const handleClubClick = (club) => {
    console.log('Selected Club Membership Types:', club.clubMembershipTypes);
    navigate(`/clubs/${club.id}`, { state: { 
      clubName: club.name,
      clubId:club.id,
      membershipTypes: club.clubMembershipTypes } });
  };
  

  const handleScroll = (direction) => {
    if (clubsRef.current) {
      clubsRef.current.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' });
    }
  };

  return (
    <div className='landing'>
      <Header />
      <section id='home'>
        <div className='home-content'>
          <h1>Level up your PickleBall game with Kourtwiz</h1>
          <p>Experience the best services with us. Start your journey today!</p>
          <div className='buttons'>
            <button className='btn' onClick={() => navigate('/club-memberships')}>
              Register Club
            </button>
          </div>
          <img src={pickleball1} alt='Pickleball Game' className='home-image' />
        </div>
      </section>

      <section id='about'>
        <div className='about-content'>
          <img src={pickleball2} alt='Pickleball Game' className='about-image' />
          <div className='about-text-box'>
            <h2>Level Up Your Game</h2>
            <p>Join Kourtwiz to enhance your Pickleball skills with expert coaching and top-tier facilities.</p>
            <button className='btn'>Learn More</button>
          </div>
        </div>
      </section>

      <section id='clubs'>
        <div className='clubs-content'>
          <h2>Clubs</h2>
          <p>Find the best club for your Pickleball journey.</p>
          <input
            type='text'
            className='search-bar'
            placeholder='Search clubs...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className='scroll-buttons'>
            <button className='scroll-btn' onClick={() => handleScroll('left')}>&lt;</button>
            <button className='scroll-btn' onClick={() => handleScroll('right')}>&gt;</button>
          </div>
          {loading ? (
            <p>Loading clubs...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <div className='clubs-container' ref={clubsRef}>
              {clubs
                .filter((club) => club.name.toLowerCase().includes(search.toLowerCase()) ||
                club.clubCity.toLowerCase().includes(search.toLowerCase()))

                .map((club) => (
                  <div
                    key={club.id}
                    className='club-card'
                    onClick={() => handleClubClick(club)}
                    style={{ backgroundColor: club.bgColor || '#f0f0f0' }}
                  >
                    <h3>{club.name}</h3>
                    <p>{club.clubCity}</p>
                  </div>
                ))}
            </div>
          )}
      </div>
      </section>

      <section id='services'>
        <div className='services-content'>
          <h2>Our Services</h2>
          <p>Enhance your Pickleball experience with our top-notch services.</p>
          <div className='services-container'>
            <div className='service-card'>
              <h3>Court Booking</h3>
              <p>
                Reserve your court easily with our seamless online booking
                system.
              </p>
            </div>
            <div className='service-card'>
              <h3>Scheduling</h3>
              <p>
                Plan your games and training sessions with our smart scheduling
                tool.
              </p>
            </div>
            <div className='service-card'>
              <h3>Play Analysis</h3>
              <p>
                Improve your game with AI-driven insights and performance
                tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

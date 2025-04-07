import "./TestimonialCard.css";
import { FaStar, FaRegStar } from "react-icons/fa";

const TestimonialCard = ({ stars, review, avatar, name }) => {
  const renderStars = () => {
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= stars) {
        starArray.push(<FaStar key={i} className="star filled" />);
      } else {
        starArray.push(<FaRegStar key={i} className="star" />);
      }
    }
    return starArray;
  };

  return (
    <div className="testimonial-card">
      <div className="stars">{renderStars()}</div>
      <p className="review">"{review}"</p>
      <div className="user-info">
        <img src={avatar} alt={name} className="avatar" />
        <p className="user-name">{name}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;

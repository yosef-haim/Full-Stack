import { useState } from "react";
import './RatingStars.css';

const RatingStars = ({ onRate }) => {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    setSelected(value);
    onRate?.(value);
  };

  return (
    <div className="rating-stars-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          xmlns="http://www.w3.org/2000/svg"
          fill={(hovered || selected) >= star ? "#facc15" : "none"}
          viewBox="0 0 24 24"
          className="star-icon"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))} 
    </div>
    
  );
};

export default RatingStars;



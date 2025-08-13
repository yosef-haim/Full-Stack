import React, { useState, useEffect } from "react";

const questions = [
  { id: "cleanliness", text: "what is your opinon about the place cleanliness?" },
  { id: "location", text: "Whats is your satisfaction from the locatoin?" },
  { id: "cost", text: "How satisfied you are from the price?" },
  { id: "service", text: "How satisfied you are from the service?" },
  {
    id: "reliability",
    text: "Did your trust of this place approved to be right?",
  },
];

const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#f5b50a" : "none"}
    stroke="#f5b50a"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="48"
    height="48"
    style={{ cursor: "pointer", transition: "fill 0.3s" }}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);

export default function SurveyPage({ userId, token, placeId }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    // אפס סטייט בתחילת טעינת העמוד
    setCurrent(0);
    setAnswers({});
    setHoveredStar(0);
  }, []);

  const handleStarClick = (value) => {
    setAnswers({ ...answers, [questions[current].id]: value });
    setHoveredStar(0);
  };

  const handleNext = async () => {
    if (!answers[questions[current].id]) {
      alert("Please rate first!");
      return;
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert("Thanks for your time.");
      console.log("Final answer:", answers);
      // כאן לקרוא API לשמירת התשובות בשרת
    }
    
    if (Object.keys(answers).length === 5) {
      const updatedAnswers = { ...answers, userId , placeId};
      setAnswers(updatedAnswers);

      console.log(updatedAnswers);

      const response = await fetch("http://localhost:5000/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // תיקון הטעות
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(updatedAnswers), // שולח את הערך המעודכן
      });

      const data = await response.json();
      console.log(data);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="survey-page">
      <h2>Tell us:</h2>
      <div className="question-box">
        <h3>{questions[current].text}</h3>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              filled={
                num <= (hoveredStar || answers[questions[current].id] || 0)
              }
              onClick={() => handleStarClick(num)}
              onMouseEnter={() => setHoveredStar(num)}
              onMouseLeave={() => setHoveredStar(0)}
            />
          ))}
        </div>
      </div>

      <div className="buttons">
        <button onClick={handlePrev} disabled={current === 0}>
          BACK
        </button>
        <button onClick={handleNext}>
          {current === questions.length - 1 ? "FINISH" : "NEXT"}
        </button>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from {opacity: 0; transform: scale(0.9);}
          to {opacity: 1; transform: scale(1);}
        }
        .survey-page {
          animation: fadeScaleIn 0.4s ease forwards;
          max-width: 480px;
          margin: 40px auto;
          padding: 20px 30px;
          background: rgba(0,0,0,0);
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          font-family: Arial, sans-serif;
          text-align: center;
          min-height: 40vh;
          display: flex; 
          flex-direction: column;
          justify-content: center;
        }
        h2 {
          margin-bottom: 30px;
          color: #333;
        }
        .question-box h3 {
          margin-bottom: 20px;
          color: #444;
          font-weight: 600;
        }
        .stars {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        .buttons {
          display: flex;
          justify-content: space-between;
        }
        button {
          padding: 10px 20px;
          background-color: #df548c ;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.25s;
        }
        button:disabled {
          background-color: #ddd;
          cursor: not-allowed;
          color: #888;
        }
        button:hover:not(:disabled) {
          background-color: #ff0055;
        }
      `}</style>
    </div>
  );
}

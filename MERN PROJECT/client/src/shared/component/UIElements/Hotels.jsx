import React, { useEffect, useState } from "react";
import "./Hotels.css"
const HotelsComponent = ({ lat, lng }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNearbyHotels = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/google-places/hotels?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      console.log(data);
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lng) {
      fetchNearbyHotels();
    }
  }, [lat, lng]);
  if (loading) return <p>טוען מלונות...</p>;

  return (
    <div className="hotel-list">
      {hotels.map((hotel) => (
        <div key={hotel.place_id} className="hotel-card">
          <div className="logo-container">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                hotel.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                textAlign: "center",
                textDecoration: "none",
              }}
              title="חפש את המלון בגוגל"
            >
              <img
                style={{
                  width: "100px",
                  borderRadius: "50%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 14px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.2)";
                }}
                src={
                  hotel.image ||
                  "https://i.pinimg.com/736x/6c/35/58/6c35581011af47821227aa978f159e08.jpg"
                }
                alt={hotel.name}
                className="hotel-logo"
              />
              <div
                style={{ marginTop: "8px", fontSize: "0.9rem", color: "#333" }}
              >
                Search on google
              </div>
            </a>
          </div>
          <h3>{hotel.name}</h3>
          <p>
            ⭐ {hotel.rating} ({hotel.user_ratings_total} ביקורות)
          </p>
          <p>{hotel.vicinity}</p>
        </div>
      ))}
    </div>
  );
};
export default HotelsComponent;

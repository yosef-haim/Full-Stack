import React, { useEffect, useState } from "react";

const RestaurantList = ({ lat, lng }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch(
        `http://localhost:5000/api/google-places/restaurants?lat=${lat}&lng=${lng}`
      );
      const data = await res.json();
      setRestaurants(data);
    };

    if (lat && lng) {
      fetchRestaurants();
    }
  }, [lat, lng]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      {restaurants.map((place) => (
        <div
          key={place.place_id}
          style={{
            backgroundColor: "#fffaf0",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100px",
          }}
        >
          <img
            src="https://static.thenounproject.com/png/fork-and-knife-icon-1181336-512.png"
            alt="Fork and Knife Icon"
            style={{ width: 42, height: 42, marginBottom: 16 }}
          />
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>
            {place.name}
          </h2>
          <p style={{ color: "#666", margin: "8px 0", textAlign: "center" }}>
            ⭐ {place.rating} | {place.vicinity}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${place.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "auto",
              color: "#df548c",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Search on Google
          </a>
        </div>
        
      ))}
    </div>
  );
};

export default RestaurantList;

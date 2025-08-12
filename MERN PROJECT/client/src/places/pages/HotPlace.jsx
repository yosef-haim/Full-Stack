import React, { useEffect, useState } from "react";
import Dashboard from "../../shared/component/UIElements/Dashboard";

function HotDestination() {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getHotDestination = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/places/hotPlace");
        const data = await res.json();
        setDestination(data);
      } catch (err) {
        console.error("Error fetching hot destination:", err);
      } finally {
        setLoading(false);
      }
    };
    getHotDestination();
  }, []);

  const place = destination?.[0] ?? {};
  function replaceBackslashWithSlash(str) {
    return str.replace(/\\/g, "/");
  }

  const imageUrl = `http://localhost:5000/${place.image}`;
  const fixedImageUrl = replaceBackslashWithSlash(imageUrl);

  if (loading) return <p>Loading hot place..</p>;

  if (!destination) return <p>No place found</p>;

  return (
    <>
      <div
        style={{
          borderRadius: "12px",
          backgroundImage: `url(${fixedImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          height: "200px",
          width: "95%",
          margin: "0px 0px 0px 30px",
          alignItems: " center",
          justifyContet: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.5rem",
          boxShadow: "inset 0 0 0 1000px rgba(0,0,0,0.5)", // כהה לקריאות
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transform: glow ? "scale(1.03)" : "scale(1)",
        }}
        onMouseEnter={() => setGlow(true)}
        onMouseLeave={() => setGlow(false)}
      >
        {/* לוגו אש בפינה */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            fontSize: "2rem",
            animation: "fire-flicker 1.5s infinite alternate",
            userSelect: "none",
            pointerEvents: "none",
          }}
          aria-label="Fire emoji"
          title="Hot place"
        >
          🔥
        </div>
        <h2
          style={{
            margin: 0,
            fontWeight: "900",
            fontSize: "1.8rem",
            textShadow: "0 0 8px rgba(255, 69, 0, 0.9)",
          }}
        >
          🌟 Hot place of this week
        </h2>
        <p
          style={{
            margin: "0.3rem 0",
            fontWeight: "600",
            textShadow: "0 0 6px rgba(0,0,0,0.7)",
          }}
        >
          <strong>Name:</strong> {destination[0].title}
        </p>
        <p
          style={{
            margin: "0.3rem 0",
            fontWeight: "600",
            textShadow: "0 0 6px rgba(0,0,0,0.7)",
          }}
        >
          <strong>Rating:</strong> {destination[0].ratings[0].rating}
        </p>
        <p
          style={{
            margin: "0.3rem 0",
            fontWeight: "600",
            textShadow: "0 0 6px rgba(0,0,0,0.7)",
          }}
        >
          <strong>Raters:</strong> {destination[0].totalRaters}
        </p>

        <style>
          {`
          @keyframes fire-flicker {
            0% { filter: drop-shadow(0 0 4px #ff4500); }
            50% { filter: drop-shadow(0 0 8px #ff6347); }
            100% { filter: drop-shadow(0 0 4px #ff4500); }
          }
        `}
        </style>
      </div>
      <div className="dashboard" style={{ marginTop: "10px" }}>
        <Dashboard
          rating={destination[0].ratings[0].rating}
          totalRaters={destination[0].totalRaters}
        />
      </div>
    </>
  );
}

export default HotDestination;

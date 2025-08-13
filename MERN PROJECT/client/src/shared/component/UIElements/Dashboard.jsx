import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Bar,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "./LoadingSpinner";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"];

const DashboardComponent = ({ rating, totalRaters, hotPlaceId }) => {
  const [allPlace, setAllPlace] = useState([]);
  const [users, setUsers] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [reviewInfo, setReviewInfo] = useState([]);

  // טען מידע על מקומות
  useEffect(() => {
    const placesInfo = async () => {
      const response = await fetch(
        "http://localhost:5000/api/places/allPlaces"
      );
      const getPlacesInfo = await response.json();
      setAllPlace(getPlacesInfo);
    };
    const usersInfo = async () => {
      const response = await fetch("http://localhost:5000/api/users");
      const getUsers = await response.json();
      setUsers(getUsers.users);
    };
    const getReviewInfo = async () => {
      const response = await fetch(
        `http://localhost:5000/api/survey/${hotPlaceId}/reviewData`
      );
      const myHotReview = await response.json();
      // ממפה את הנתונים בצורה עקבית לשדות parameter ו-rating
      const myHotReviewAvg = (myReviews) => {
        const cleanliness =
          myReviews.reduce((sum, a) => sum + a.cleanliness, 0) /
          myReviews.length;
        const location =
          myReviews.reduce((sum, a) => sum + a.location, 0) / myReviews.length;
        const cost =
          myReviews.reduce((sum, a) => sum + a.cost, 0) / myReviews.length;
        const service =
          myReviews.reduce((sum, a) => sum + a.service, 0) / myReviews.length;
        const reliability =
          myReviews.reduce((sum, a) => sum + a.reliability, 0) / myReviews.length;

        return { cleanliness, location, cost, service, reliability };
      };

      const chartData = Object.entries(myHotReviewAvg(myHotReview))
        .filter(([key]) => key !== "_id")
        .map(([key, value]) => ({
          parameter: key,
          rating: typeof value === "number" && !isNaN(value) ? value : 0, // ודא מספר תקין
        })); // בחר את 6 הפרמטרים הרלוונטיים

      setReviewInfo(chartData);
    };

    placesInfo();
    usersInfo();
    getReviewInfo();
  }, [hotPlaceId]);

  // מחשב נתוני עוגה של אחוזים
  useEffect(() => {
    if (users.length === 0) return;

    const percentageRated = (totalRaters / users.length) * 100;
    const percentageNotRated = 100 - percentageRated;

    const data = [
      { name: "Rated", value: parseFloat(percentageRated.toFixed(2)) },
      { name: "Not Rated", value: parseFloat(percentageNotRated.toFixed(2)) },
    ];
    setPieData(data);
  }, [users, totalRaters]);

  // פונקציה פשוטה לחישוב קו מגמה ליניארי (Trend Line)
  function calculateTrendLine(data) {
    const n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    data.forEach((point, i) => {
      sumX += i;
      sumY += point.rating;
      sumXY += i * point.rating;
      sumXX += i * i;
    });

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) {
      // מקרה מיוחד, החזר את הנתונים ללא שינוי
      return data.map((point) => ({ ...point, trend: point.rating }));
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    return data.map((point, i) => ({
      ...point,
      trend: m * i + b,
    }));
  }

  // מחשב את הנתונים עם קו המגמה
  const dataWithTrend = calculateTrendLine(reviewInfo);

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {pieData.length > 0 ? (
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      ) : (
        <LoadingSpinner />
      )}

      {/* דיאגרמת עמודות עם קו מגמה */}
      {reviewInfo.length > 0 ? (
        <ResponsiveContainer width="60%" height={200}>
          <BarChart
            data={dataWithTrend}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="parameter" />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="#8884d8" name="Rating" />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
              name="Trend Line"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default DashboardComponent;

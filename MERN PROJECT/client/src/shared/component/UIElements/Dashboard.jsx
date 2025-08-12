import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const DashboardComponent = ({ rating, totalRaters }) => {
  const [allPlace, setAllPlace] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"];

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
    placesInfo();
    usersInfo();
  }, []);

  useEffect(() => {
    const RatingsPieChart = (totalRaters, usersLength) => {
      const percentageRated = (totalRaters / usersLength) * 100;
      const percentageNotRated = 100 - percentageRated;

      const data = [
        { name: "Rated", value: parseFloat(percentageRated.toFixed(2)) },
        { name: "Not Rated", value: parseFloat(percentageNotRated.toFixed(2)) },
      ];
      setData(data);
    };
    console.log(data);
    RatingsPieChart(totalRaters, users.length);
  }, [users]);

  return (
    <PieChart width={400} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        outerRadius={50}
        fill="#8884d8"
        dataKey="value"
        animationBegin={0}
        animationDuration={1000}
      >
        {data.map((entry, index) => (
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
  );
};

export default DashboardComponent;

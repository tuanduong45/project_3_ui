import React, { useEffect, useState } from "react";

import Report from "../api/statistics";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import getTokenFromLocalStorage from "../service/getTokenFromLocalStorage";
ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryReport = () => {
  const auth = getTokenFromLocalStorage();

  const [data, setData] = useState([]);

  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = async () => {
    try {
      const response = await axios.get(Report.inventory, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy dữ liệu theo tháng");
    }
  };
  const chartData = {
    labels: data.map((item) => item.drugGroupName),
    datasets: [
      {
        label: "Số lượng",
        data: data.map((item) => item.quantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div
      style={{
        width: "600px",

        marginLeft: "40px",
        marginTop: "50px",
      }}
    >
      <h1 style={{ fontWeight: "bold" }}>Báo cáo tồn kho </h1>
      <Pie data={chartData} />;
    </div>
  );
};
export default InventoryReport;

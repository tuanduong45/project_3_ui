import React, { useEffect, useState } from "react";

import Report from "../api/statistics";
import axios from "axios";

import { DatePicker, Select, Space } from "antd";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import getTokenFromLocalStorage from "../service/getTokenFromLocalStorage";
Chart.register(BarElement, LinearScale, CategoryScale);
const { RangePicker } = DatePicker;
const ImportReport = () => {
  const auth = getTokenFromLocalStorage();

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    getDataByDate();
  }, [startDate, endDate]);

  const getDataByDate = async () => {
    try {
      const response = await axios.get(Report.importByDate, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      setData(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy dữ liệu theo tháng");
    }
  };
  console.log(data);

  console.log(status);
  const onChange = (dates, dateStrings) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const chartData = {
    labels: data.map((item) => item.drugName),
    datasets: [
      {
        label: "Số lượng",
        data: data.map((item) => item.quantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
      },
    ],
  };
  const options = {
    type: "bar",
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div>
      <div style={{ marginTop: "90px" }}>
        <h1 style={{ fontWeight: "bold" }}>Báo cáo nhập kho </h1>

        <Space>
          <RangePicker
            onChange={onChange}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Space>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};
export default ImportReport;

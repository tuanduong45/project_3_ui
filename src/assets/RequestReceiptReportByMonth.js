import axios from "axios";
import Report from "../api/statistics";
import { useEffect, useState } from "react";
import { Space, DatePicker, Button } from "antd";
import getTokenFromLocalStorage from "../service/getTokenFromLocalStorage";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const { RangePicker } = DatePicker;
Chart.register(BarElement, LinearScale, CategoryScale);
const RequestReceiptReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const auth = getTokenFromLocalStorage();
  const [data, setData] = useState([]);
  const [summarizeData, setSummarizeData] = useState([]);
  const [startDateReport, setStartDateReport] = useState("");
  const [endDateReport, setEndDateReport] = useState("");

  const headers = [
    { key: "drugName", label: "Tên sản phẩm" },
    { key: "importQuantity", label: "Số lượng nhập" },
    { key: "exportQuantity", label: "Số lượng xuất" },

    { key: "inventoryQuantity", label: "Số lượng tồn kho" },
    { key: "unitName", label: "Đơn vị tính" },
    { key: "total", label: "Tổng tiền" },
    { key: "note", label: "Ghi chú" },
  ];

  const title = "Báo cáo tổng hợp";
  const date =
    "Từ ngày" +
    "  " +
    startDateReport +
    "  " +
    "đến ngày" +
    "  " +
    endDateReport;

  useEffect(() => {
    getListReportByDate();
  }, [startDate, endDate]);

  useEffect(() => {
    getSummarizeReport();
  }, [startDateReport, endDateReport]);

  const getListReportByDate = async () => {
    try {
      const response = await axios.get(Report.requestReceiptByDate, {
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
      console.log(error);
    }
  };

  const getSummarizeReport = async () => {
    try {
      const response = await axios.get(Report.summarizeReport, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        params: {
          startDate: startDateReport,
          endDate: endDateReport,
        },
      });
      setSummarizeData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDate = (dates, dateStrings) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };
  const onChangeDateSummarize = (dates, dateStrings) => {
    if (dates) {
      setStartDateReport(dateStrings[0]);
      setEndDateReport(dateStrings[1]);
    } else {
      setStartDateReport("");
      setEndDateReport("");
    }
  };

  const exportReportExcel = () => {
    // Chuyển đổi dữ liệu và tiêu đề cột thành một mảng các mảng
    const worksheetData = [
      [title], // Tiêu đề của báo cáo
      [date],
      [], // Hàng trống để ngăn cách tiêu đề và tên các cột
      headers.map((header) => header.label), // Tên các cột
      ...summarizeData.map((item) => headers.map((header) => item[header.key])), // Dữ liệu
      [],
      [],
      ["", "", "", "", "", "Hà Nội,ngày   tháng    năm"],
      ["Người lập:", "", "", "", "", "Thủ kho dược"],
    ];

    // Tạo một worksheet từ dữ liệu
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Merge ô để đặt tiêu đề ở giữa
    const mergeCell = {
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 },
    };
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(mergeCell);

    // Tạo một workbook mới và thêm worksheet vào
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo");

    // Ghi workbook thành một file Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Tạo một Blob từ buffer
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Lưu file
    saveAs(blob, "Báo cáo tổng hợp.xlsx");
  };

  const chartData = {
    labels: data.map((item) => item.departmentName),
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
      <div>
        <Button
          icon={<FontAwesomeIcon icon={faFileExcel} />}
          style={{ marginLeft: "550px", marginTop: "20px", fontWeight: "bold" }}
          onClick={exportReportExcel}
        >
          Xuất báo cáo tổng hợp{" "}
        </Button>
        <RangePicker
          onChange={onChangeDateSummarize}
          placeholder={["Từ ngày", "Đến ngày"]}
          style={{ marginLeft: "550px" }}
        />
      </div>

      <div>
        <h1 style={{ fontWeight: "bold" }}>Báo cáo cấp thuốc </h1>
        <Space size={15}>
          <RangePicker
            onChange={onChangeDate}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Space>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
export default RequestReceiptReport;

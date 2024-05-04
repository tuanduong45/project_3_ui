import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

const User = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getTokenFromLocalStorage = () => {
    // Lấy dữ liệu từ Local Storage với key là 'token'
    const tokenData = localStorage.getItem("token");

    // Kiểm tra nếu dữ liệu tồn tại
    if (tokenData) {
      // Parse dữ liệu từ JSON về object
      const tokenObject = JSON.parse(tokenData);
      // Trả về trường token từ object
      return tokenObject.token;
    } else {
      // Nếu không tìm thấy dữ liệu, trả về null hoặc giá trị mặc định tùy thuộc vào trường hợp của bạn
      return null;
    }
  };
  const auth = getTokenFromLocalStorage();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get("http://localhost:8081/user/getList", {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      console.log(response);
      const modifiedData = response.data.map((item, index) => ({
        ...item,
        stt: index + 1,
      }));

      setData(modifiedData); // Lưu dữ liệu từ API vào state
      // Đã nhận dữ liệu, tắt trạng thái loading
    } catch (error) {
      console.error("Error fetching data:", error);
      // Đã xảy ra lỗi, tắt trạng thái loading
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <span style={{ color: "blue" }}>STT</span>,
      dataIndex: "stt",
      key: "stt",
      width: 50,
    },
    {
      title: <span style={{ color: "blue" }}>Name</span>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <span style={{ color: "blue" }}>BirthDate</span>,
      dataIndex: "address",
      key: "address",
    },
    {
      title: <span style={{ color: "blue" }}>Email</span>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <span style={{ color: "blue" }}>Phone</span>,
      dataIndex: "phoneNumber",
      key: "phone",
    },
    {
      title: <span style={{ color: "blue" }}>Code</span>,
      dataIndex: "code",
      key: "code",
    },
    {
      title: <span style={{ color: "blue" }}>Actions</span>,
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];
  const handleEdit = () => {};
  const handleDelete = () => {};
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => record.id} // Thay 'id' bằng khóa chính của dữ liệu từ API
    />
  );
};
export default User;

import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input } from "antd";
import "antd/dist/reset.css";
import axios from "axios";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Modal, notification } from "antd";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import department from "../../api/department";
import { useNavigate } from "react-router-dom";

const Department = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterData, setFilteredData] = useState(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState("add"); // Mặc định là thêm mới
  const [isEditForm, setIsEditForm] = useState(false);

  const auth = getTokenFromLocalStorage();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get(department.getList, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
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

  // Gọi hàm để lấy dữ liệu từ API tìm kiếm khi nhập text vào input tìm ki
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchText !== "") {
        const response = await axios.get(department.getList, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          params: {
            name: searchText,
          },
        });
        const modifiedData = response.data.map((item, index) => ({
          ...item,
          stt: index + 1,
        }));
        setFilteredData(modifiedData);
      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
    }
  };
  // button add department
  const handleModalOk = async () => {
    // Get form values from the popup
    const form = document.getElementById("DepartmentForm");
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const phoneNumber = form.elements.phone.value;
    const address = form.elements.address.value;
    const code = form.elements.code.value;
    if (!name || !code) {
      notification.error({
        message: "Vui lòng nhập đầy đủ tên và mã Khoa/Bộ phận!",
        description: "Cả hai trường 'Tên' và 'Mã' đều là bắt buộc.",
      });
      return; // Prevent further processing if fields are empty
    }
    // Call API to add new department
    try {
      const response = await axios.post(
        department.create,
        { name, email, phoneNumber, address, code },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      console.log("Department added successfully:", response.data);
      // Update data after successful addition
      fetchData();
      setModalVisible(false); // Close the popup
      notification.open({
        message: "Thêm Khoa/Bộ phận thành công!",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      console.error("Error adding department:", error);
      notification.error({
        message: "Lỗi khi thêm Khoa/Bộ phận",
        description:
          error.message || "Có lỗi xảy ra trong quá trình thêm dữ liệu.",
        style: {
          backgroundColor: "#ff4d4d", // Red background
          color: "#ffffff", // White text
        },
      });
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
      title: <span style={{ color: "blue" }}>Address</span>,
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
  const handleEdit = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phoneNumber,
      address: record.address,
      code: record.code,
    });
    setIsEditForm(true);
    setModalVisible(true); // Mở modal
  };

  const handleDelete = (record) => {
    setDeleteModalVisible(true);
    setSelectedRecord(record);
  };
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${department.delete}?id=${selectedRecord.id}`,
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      fetchData();
      setDeleteModalVisible(false);
      notification.open({
        message: "Xóa Khoa/Bộ phận thành công!",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleAddDepartment = () => {
    form.resetFields();
    setIsEditForm(false);
    setModalMode("add");
    setModalVisible(true); // Open the popup
  };
  const handleModalCancel = () => {
    modalVisible ? setModalVisible(false) : setDeleteModalVisible(false);
    // Close the popup
  };
  const handleUpdateOk = async () => {
    try {
      const name = form.getFieldValue("name");
      const email = form.getFieldValue("email");
      const phoneNumber = form.getFieldValue("phone");
      const address = form.getFieldValue("address");
      /* console.log(name);
      console.log(email);
      console.log(phoneNumber);
      console.log(address);
      console.log(selectedRecord.id); */
      if (!name) {
        notification.error({
          message: "Vui lòng nhập đầy đủ tên Khoa/Bộ phận!",
        });
        return;
      }
      // Gọi API cập nhật với các thông tin cập nhật và ID của dòng dữ liệu
      const respose = await axios.put(
        `${department.update}?id=${selectedRecord.id}`,
        {
          name,
          email,
          phoneNumber,
          address,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      // Update data after successful addition
      fetchData();
      setModalVisible(false); // Close the popup
      // Gọi hàm onUpdate để thông báo cho component cha rằng dữ liệu đã được cập nhật
      notification.open({
        message: "Cập nhật Khoa/Bộ phận thành công!",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            marginBottom: "30px",
            color: "#2227D6",
            fontWeight: "bold",
          }}
        >
          Quản lý Khoa-Bộ phận
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "30px",
            marginBottom: "30px",
          }}
        >
          <Input
            placeholder="Tìm kiếm theo tên Khoa bộ phận "
            style={{ marginRight: "10px", width: "400px" }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginRight: "20px" }}
          >
            Tìm kiếm
          </Button>
          <Button type="primary" onClick={handleAddDepartment}>
            Thêm Khoa bộ phận
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={searchText !== "" ? filterData : data}
        loading={loading}
        rowKey={(record) => record.id} // Thay 'id' bằng khóa chính của dữ liệu từ API
      />
      <Modal
        title={
          modalMode === "add" ? "Thêm Khoa bộ phận" : "Cập nhật Khoa bộ phận"
        }
        visible={modalVisible}
        onOk={modalMode === "add" ? handleModalOk : handleUpdateOk}
        onCancel={handleModalCancel}
        form={form}
      >
        <Form form={form} id="DepartmentForm">
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Code" name="code">
            <Input disabled={isEditForm} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p style={{ fontSize: "20px", color: "blue" }}>
          Bạn có chắc chắn muốn xóa ?
        </p>
      </Modal>
    </div>
  );
};

export default Department;

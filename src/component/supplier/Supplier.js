import React, { useState, useEffect } from "react";
import axios, { formToJSON } from "axios";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import supplier from "../../api/supplier";
import { Table, Space, Button, Input, Modal, Form, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

const Supplier = () => {
  const auth = getTokenFromLocalStorage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterData, setFilteredData] = useState(data);
  const [modalVisibleForm, setModalVisibleForm] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const alphabetRegex = /^[\p{L}\s]+$/u;
  const numericRegex = /^[0-9]+$/;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get(supplier.getList, {
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

  const openUpdateSupplierForm = (record) => {
    setModalMode("edit");
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      phoneNumber: record.phoneNumber,
      email: record.email,
      taxCode: record.taxCode,
      representativeName: record.representativeName,
    });
    setSelectedRecord(record);
    setModalVisibleForm(true);
  };
  const openDeleteSupplierForm = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };
  const handleDeleteSupplier = async () => {
    try {
      await axios.put(`${supplier.delete}?supplierId=${selectedRecord.id}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      fetchData();
      setDeleteModalVisible(false);
      notification.info({
        message: "Xóa nhà cung cấp thành công",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi xóa nhà cung cấp",
      });
    }
  };
  const openAddSupplierForm = () => {
    setModalMode("add");
    form.resetFields();
    setModalVisibleForm(true);
  };
  const handleAddSupplier = async () => {
    const values = form.getFieldsValue();

    try {
      const response = await axios.post(supplier.create, values, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      fetchData();
      setModalVisibleForm(false);
      notification.info({
        message: "Thêm nhà cung cấp thành công",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi thêm nhà cung cấp",
      });
    }
  };
  const handleUpdateSupplier = async () => {
    const values = form.getFieldsValue();
    console.log(values);
    console.log(selectedRecord.id);
    try {
      const response = await axios.put(
        `${supplier.update}?id=${selectedRecord.id}`,
        values,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      fetchData();
      setModalVisibleForm(false);
      notification.info({
        message: "Cập nhật thông tin nhà cung cấp thành công",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi cập nhật nhà cung cấp",
      });
    }
  };
  const handleCancel = () => {
    setModalVisibleForm(false);
    setDeleteModalVisible(false);
  };
  const handleSearch = async () => {
    setLoading(true);
    try {
      let searchParams = {};
      if (alphabetRegex.test(searchText)) {
        searchParams = { name: searchText };
      } else if (numericRegex.test(searchText)) {
        searchParams = { taxCode: searchText };
      }
      console.log(searchText);
      console.log(searchParams);
      if (searchText !== "") {
        const response = await axios.get(supplier.getList, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          params: searchParams,
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

  const columns = [
    {
      title: <span style={{ color: "blue" }}>STT</span>,
      dataIndex: "stt",
      key: "stt",
      width: 50,
    },
    {
      title: <span style={{ color: "blue" }}>Tên nhà cung cấp</span>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <span style={{ color: "blue" }}>Người đại diện</span>,
      dataIndex: "representativeName",
      key: "representativeName",
    },
    {
      title: <span style={{ color: "blue" }}>Email</span>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <span style={{ color: "blue" }}>Số điện thoại</span>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: <span style={{ color: "blue" }}>Địa chỉ</span>,
      dataIndex: "address",
      key: "address",
    },
    {
      title: <span style={{ color: "blue" }}>Mã số thuế</span>,
      dataIndex: "taxCode",
      key: "taxCode",
    },
    {
      title: <span style={{ color: "blue" }}>Thao tác</span>,
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            onClick={() => openUpdateSupplierForm(record)}
          />
          <Button
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => openDeleteSupplierForm(record)}
          />
        </Space>
      ),
    },
  ];

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
          Quản lý Nhà cung cấp
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
            placeholder="Tìm kiếm theo tên hoặc mã số thuế"
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
          <Button type="primary" onClick={openAddSupplierForm}>
            Thêm nhà cung cấp
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={searchText !== "" ? filterData : data}
        loading={loading}
        rowKey={(record) => record.id}
      />
      <Modal
        visible={modalVisibleForm}
        onOk={modalMode === "add" ? handleAddSupplier : handleUpdateSupplier}
        onCancel={handleCancel}
        title={
          modalMode === "add"
            ? "Thêm nhà cung cấp"
            : "Cập nhật thông tin nhà cung cấp"
        }
        form={form}
      >
        <Form form={form}>
          <Form.Item label="Tên nhà cung cấp" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Mã số thuế" name="taxCode">
            <Input disabled={modalMode === "edit"} />
          </Form.Item>
          <Form.Item label="Người đại diện" name="representativeName">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        onOk={handleDeleteSupplier}
        onCancel={handleCancel}
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
export default Supplier;

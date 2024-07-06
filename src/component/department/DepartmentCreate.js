import { useState } from "react";
import { Button, Input, Form, notification } from "antd";
import axios from "axios";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import department from "../../api/department";

const DepartmentCreate = () => {
  const auth = getTokenFromLocalStorage();
  const [form] = Form.useForm();

  const handleModalOk = async () => {
    const values = form.getFieldsValue();
    const { name, email, phone, address, code } = values;
    if (!name || !code) {
      notification.error({
        message: "Vui lòng nhập đầy đủ tên và mã Khoa/Bộ phận!",
        description: "Cả hai trường 'Tên' và 'Mã' đều là bắt buộc.",
      });
      return;
    }
    try {
      const response = await axios.post(
        department.create,
        { name, email, phone, address, code },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      console.log("Department added successfully:", response.data);
      notification.open({
        message: "Thêm Khoa/Bộ phận thành công!",
        style: {
          backgroundColor: "#008CBA",
          color: "#ffffff",
        },
      });
      form.resetFields();
    } catch (error) {
      console.error("Error adding department:", error);
      notification.error({
        message: "Lỗi khi thêm Khoa/Bộ phận",
        description:
          error.message || "Có lỗi xảy ra trong quá trình thêm dữ liệu.",
        style: {
          backgroundColor: "#ff4d4d",
          color: "#ffffff",
        },
      });
    }
  };

  return (
    <div>
      <h2>Thêm Khoa/Bộ phận</h2>
      <Form
        id="DepartmentForm"
        form={form}
        layout="vertical"
        onFinish={handleModalOk}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
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
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please input the code!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DepartmentCreate;

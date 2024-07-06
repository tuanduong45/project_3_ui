import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  notification,
} from "antd";
import axios, { formToJSON } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import user from "../../api/user";
import comboBox from "../../api/comboBox";
import moment from "moment";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import role from "../../api/role";
import getRefreshTokenFromLocalStorage from "../../service/getRefreshTokenFromLocalStorage";

export const listStatus = [
  {
    name: "Đang hoạt động",
    value: "ACTIVE",
  },
  {
    name: "Tắt hoạt động",
    value: "DISABLED",
  },
  {
    name: "Tạm dừng hoạt động",
    value: "INACTIVE",
  },
];
const User = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterData, setFilteredData] = useState(data);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [lstDepartment, setLstDepartment] = useState([]);
  const [lstRole, setLstRole] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [codeEditForm, setCodeEditForm] = useState(false);
  //const [roles, setRoles] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [departmentNameNow, setDepartmentNameNow] = useState("");

  const [form] = Form.useForm();

  const { Option } = Select;
  const auth = getTokenFromLocalStorage();
  const refAuth = getRefreshTokenFromLocalStorage();

  // hàm lấy departmentId từ departmentName
  const getDepartmentIdByName = (departmentName) => {
    const department = lstDepartment.find(
      (dept) => dept.name === departmentName
    );
    return department ? department.id : null;
  };
  // hàm lấy danh sách roleID từ danh sách roleName
  const getRoleIdsByNames = (roleNames) => {
    return lstRole
      .filter((role) => roleNames.includes(role.name))
      .map((role) => role.id);
  };
  // hàm tách firstname và lastname từ fullname
  const splitFullname = (fullname) => {
    const nameParts = fullname.trim().split(" ");
    if (nameParts.length === 1) {
      return {
        firstname: nameParts[0],
        lastname: "",
      };
    } else {
      return {
        firstname: nameParts[0],
        lastname: nameParts.slice(1).join(" "),
      };
    }
  };

  const handleRoleChange = (selectedValues) => {
    setSelectedRoleIds(selectedValues);
  };
  const handleDepartmentChange = (selectedValue) => {
    setSelectedDepartmentId(selectedValue);
  };
  // lấy dữ liệu department
  const getComboBoxDepartment = async () => {
    try {
      const response = await axios.get(comboBox.department);
      setLstDepartment(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  // lấy dữ liệu role
  const getComboBoxRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(comboBox.role);

      setLstRole(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    getComboBoxDepartment();
    getComboBoxRoles();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get(user.getList, {
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
      dataIndex: "birthDate",
      key: "birthDate",
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

  const handleUpdateOk = async () => {
    try {
      const identificationNumber = form.getFieldValue("identificationNumber");
      const identityTypeName = form.getFieldValue("identityTypeName");
      const fullName = form.getFieldValue("name");
      const birthDate = form.getFieldValue("birthDate");
      const phoneNumber = form.getFieldValue("phoneNumber");
      const email = form.getFieldValue("email");
      const lstRoleName = selectedRoleIds; // !== roles ? selectedRoleIds : roles;
      const lstRoleId = getRoleIdsByNames(lstRoleName);
      const departmentName = selectedDepartmentId;
      const departmentID = getDepartmentIdByName(departmentName);
      const { firstname, lastname } = splitFullname(fullName);
      const firstName = firstname;
      const lastName = lastname;
      /* console.log(lstRoleName);
      console.log(lstRoleId);
      console.log(departmentID);
      console.log(departmentName);
      console.log(roles);
      console.log(selectedRoleIds); 
       console.log(departmentNameNow);
      console.log(departmentName);
      console.log(lstRoleName);
      console.log(selectedDepartmentId); */

      if (!firstName || !lastName) {
        notification.error({
          message: "Vui lòng nhập đầy đủ tên !",
        });
        return;
      }
      if (!phoneNumber) {
        notification.error({
          message: "Vui lòng nhập số điện thoại !",
        });
        return;
      }
      if (!departmentName) {
        notification.error({
          message: "Vui lòng chọn phòng ban !",
        });
      }

      const response = await axios.put(
        `${user.update}?id=${selectedRecord.id}`,
        {
          identificationNumber,
          identityTypeName,
          firstName,
          lastName,
          birthDate,
          phoneNumber,
          email,
          lstRoleId,
          departmentID,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      fetchData();
      setIsFormVisible(false);
      notification.open({
        message: "Cập nhật người dùng thành công!",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      console.log("Error update user", error);
    }
  };

  // hàm edit của mỗi record dữ liệu
  const handleEdit = async (record) => {
    setModalMode("edit");
    setSelectedRecord(record);

    form.setFieldsValue({
      identificationNumber: record.identificationNumber,
      identityTypeName: record.identityType,
      name: record.name,
      birthDate: moment(record.birthDate, "YYYY-MM-DD"),
      phoneNumber: record.phoneNumber,
      code: record.code,
      email: record.email,
      phoneNumber: record.phoneNumber,
      department: record.departmentName,
      role: [],
    });

    // setDepartmentNameNow(record.departmentName);
    setSelectedDepartmentId(record.departmentName);
    // lấy danh sách rolename từ userID
    try {
      // Asynchronously fetch role names using record ID
      const response = await axios.get(
        `${role.getRoleName}?userID=${record.id}`
      );
      // setRoles(response.data);
      setSelectedRoleIds(response.data);

      // Update form values with retrieved roles
      form.setFieldsValue({
        role: response.data,
      });
    } catch (error) {
      console.error("Error fetching role names:", error);
      // Consider adding user-friendly error notification
    }

    setIsFormVisible(true);
    setCodeEditForm(true);
  };

  // hàm xóa của mỗi record dữ liệu
  const handleDelete = (record) => {
    setDeleteModalVisible(true);
    setSelectedRecord(record);
  };

  //`${user.switchStatus}?id=${selectedRecord.id}&status=DISABLED`
  const handleUpdateStatus = async () => {
    try {
      const response = await axios.get(user.switchStatus, {
        headers: { Authorization: `Bearer ${auth}` },
        params: {
          id: selectedRecord.id,
        },
      });
      if (response.status === 200) {
        fetchData();
        setDeleteModalVisible(false);
        notification.open({
          message: "Xóa Người dùng thành công!",
          style: {
            backgroundColor: "#008CBA", // Green background
            color: "#ffffff", // White text
          },
        });
      } else {
        // Handle non-200 status code errors (e.g., display specific error message to user)
        console.error("API request failed:", response.statusText);
        notification.open({
          message: "Xóa Người dùng thất bại!",
          style: {
            backgroundColor: "#f44336", // Red background
            color: "#ffffff", // White text
          },
        });
      }
    } catch (error) {
      console.error("Error delete data:", error);
    }
  };
  // hàm xác nhận thêm user
  const handleAddOk = async () => {
    const identificationNumber = form.getFieldValue("identificationNumber");
    const identityTypeName = form.getFieldValue("identityTypeName");
    const firstName = form.getFieldValue("firstName");
    const lastName = form.getFieldValue("lastName");
    const birthDate = form.getFieldValue("birthDate");
    const phoneNumber = form.getFieldValue("phoneNumber");
    const email = form.getFieldValue("email");
    const lstRoleName = selectedRoleIds;
    const lstRoleId = getRoleIdsByNames(lstRoleName);
    const departmentName = selectedDepartmentId;
    const departmentID = getDepartmentIdByName(departmentName);
    /* console.log(identificationNumber);
    console.log(identityTypeName);
    console.log(firstName);
    console.log(lastName);
    console.log(birthDate);
    console.log(email);
    console.log(lstRoleId);
    console.log(departmentID); */

    try {
      const response = await axios.post(
        user.add,
        {
          identificationNumber,
          identityTypeName,
          firstName,
          lastName,
          birthDate,
          phoneNumber,
          email,
          lstRoleId,
          departmentID,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      console.log("User added successfully:", response.data);
      fetchData();
      setIsFormVisible(false);
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
  const handleCancel = () => {
    isFormVisible ? setIsFormVisible(false) : setDeleteModalVisible(false);
  };
  const handleAddUser = () => {
    form.resetFields();
    setIsFormVisible(true);
    setModalMode("add");
  };
  // hàm bấm button tìm kiếm
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchText !== "") {
        const response = await axios.get(user.getList, {
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
          Quản lý người dùng
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
            placeholder="Tìm kiếm theo tên người dùng "
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
          <Button type="primary" onClick={handleAddUser}>
            Thêm Người dùng
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
        visible={isFormVisible}
        onOk={modalMode === "add" ? handleAddOk : handleUpdateOk}
        onCancel={handleCancel}
        title={
          modalMode === "add"
            ? "Thêm người dùng"
            : "Cập nhật thông tin người dùng"
        }
        form={form}
      >
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          id="AddUserForm"
        >
          <Form.Item
            label="Identification Number"
            name="identificationNumber"
            rules={[
              {
                required: true,
                message: "Please input your identification number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="IdentityType "
            name="identityTypeName"
            rules={[
              { required: true, message: "Please select identity type name!" },
            ]}
          >
            <Select>
              <Option value="Chứng minh nhân dân">Chứng minh nhân dân</Option>
              <Option value="Căn cước công dân">Căn cước công dân</Option>
              <Option value="Hộ chiếu">Hộ chiếu</Option>
            </Select>
          </Form.Item>

          {modalMode === "add" ? (
            <>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label="BirthDate"
            name="birthDate"
            rules={[
              { required: true, message: "Please select your birth date!" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Phone  "
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          {modalMode === "edit" ? (
            <Form.Item label="Code" name="code">
              <Input disabled={codeEditForm} />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department !" }]}
          >
            <Select
              placeholder="Select department"
              value={selectedDepartmentId}
              onChange={handleDepartmentChange}
            >
              {lstDepartment.map((department) => (
                <Option key={department.id} value={department.name}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select
              placeholder="Select roles"
              mode="multiple"
              onChange={handleRoleChange}
              value={selectedRoleIds}
            >
              {lstRole.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        onOk={handleUpdateStatus}
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
export default User;

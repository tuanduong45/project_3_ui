import { useState, useEffect, Children } from "react";
import drug from "../../api/drug";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons/faSquarePlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  Table,
  Button,
  Space,
  Collapse,
  Input,
  Form,
  Modal,
  Select,
  DatePicker,
} from "antd";
import classNames from "classnames/bind";
import style from "./Drug.module.css";
import drugGroup from "../../api/drugGroup";
import { notification } from "antd";
import unit from "../../api/unit";
import moment from "moment";

const cx = classNames.bind(style);
const { Panel } = Collapse;
const { Option } = Select;
const Drug = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const auth = getTokenFromLocalStorage();
  const [filterData, setFilteredData] = useState(data);
  const [DrugGroupModalVisible, setDrugGroupModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [drugAddForm] = Form.useForm();
  const [addDrugModalVisible, setAddDrugModalVisible] = useState(false);
  const [lstUnit, setLstUnit] = useState([]);
  const [selectedUnitIds, setSelectedUnitIds] = useState([]);
  const [drugGroupName, setDrugGroupName] = useState("");
  const [modalModeDrugGroupForm, setModalModeDrugGroupForm] = useState("");
  const [modalModeDrugForm, setModalModeDrugForm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalModeDelete, setModalModeDelete] = useState("");

  useEffect(() => {
    fetchData();
    getListUnitIdNameCvrRule();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get(drug.getList, {
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
  const getListUnitIdNameCvrRule = async () => {
    try {
      const response = await axios.get(unit.getList);
      setLstUnit(response.data);
    } catch (error) {
      console.error("Error fetching unit:", error);
    }
  };
  const handleUnitChange = (selectedValues) => {
    setSelectedUnitIds(selectedValues);
  };
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchText.trim() !== " ") {
        const response = await axios.get(drug.getList, {
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
        //setData(modifiedData);
      } else {
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
    }
  };
  // hàm check các trường của columns có null hết k ?
  const isEmptyDrug = (drug) => {
    return columns.slice(1).every((col) => !drug[col.dataIndex]);
  };

  // lấy id từ category name
  const getIdFromDrugGroupName = async (categoryName) => {
    try {
      const response = await axios.get(
        `${drugGroup.getId}?name=${categoryName}`
      );
      return response.data;
    } catch (error) {
      console.error("Error get Drug Group Id :", error);
      return null;
    }
  };

  const getDrugGroupDescribeFromName = async (categoryName) => {
    try {
      const response = await axios.get(
        `${drugGroup.getDrugGroupDescribe}?name=${categoryName}`
      );
      return response.data;
    } catch (error) {
      console.error("Error get Drug Group Id :", error);
      return null;
    }
  };

  const handleUpdateDrugGroup = async () => {
    const drugGroupDescribe = form.getFieldValue("drugGroupDescribe");

    if (!drugGroupDescribe) {
      notification.error({
        message: "Vui lòng nhập mô tả danh mục thuốc",
      });
    }
    const id = await getIdFromDrugGroupName(drugGroupName);
    try {
      const response = await axios.put(
        `${drugGroup.update}?id=${id}`,
        {
          drugGroupDescribe,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      fetchData();
      setDrugGroupModalVisible(false);
      notification.error({
        message: "Cập nhật danh mục thuốc thành công",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi cập nhật danh mục thuốc",
        style: {
          backgroundColor: "#ff4d4d", // Green background
          color: "#ffffff", // White text
        },
      });
    }
  };

  const handleAddDrugGroup = async () => {
    const drugGroupName = form.getFieldValue("drugGroupName");
    const drugGroupDescribe = form.getFieldValue("drugGroupDescribe");
    console.log(drugGroupName);
    console.log(drugGroupDescribe);
    if (!drugGroupName) {
      notification.error({
        message: "Vui lòng nhập tên danh mục thuốc",
      });
      return; // Prevent further processing if fields are empty
    }
    if (!drugGroupDescribe) {
      notification.error({
        message: "Vui lòng nhập mô tả danh mục thuốc",
      });
      return;
    }
    try {
      const response = await axios.post(
        drugGroup.create,
        { drugGroupName, drugGroupDescribe },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      fetchData();
      setDrugGroupModalVisible(false);
      notification.open({
        message: "Thêm danh mục thuốc thành công!",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      console.error("Error adding drug group:", error);
      notification.error({
        message: "Lỗi khi thêm danh mục thuốc",
        style: {
          backgroundColor: "#ff4d4d", // Red background
          color: "#ffffff", // White text
        },
      });
    }
  };
  const openUpdateDrugGroupForm = async (categoryName) => {
    setDrugGroupModalVisible(true);
    setModalModeDrugGroupForm("edit");
    setDrugGroupName(categoryName);
    const drugGroupDescribe = await getDrugGroupDescribeFromName(categoryName);
    form.setFieldsValue({
      drugGroupName: categoryName,
      drugGroupDescribe: drugGroupDescribe,
    });
  };
  const handleDeleteDrugGroup = async () => {
    const id = await getIdFromDrugGroupName(drugGroupName);
    try {
      const response = await axios.delete(`${drugGroup.delete}?id=${id}`);
      fetchData();
      setDeleteModalVisible(false);
      notification.info({
        message: "Xóa danh mục thuốc thành công",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi xóa danh mục thuốc",
      });
    }
  };
  const handleAddDrug = async () => {
    const name = drugAddForm.getFieldValue("name");
    const activeSubstance = drugAddForm.getFieldValue("activeSubstance");
    const expiryDate = drugAddForm.getFieldValue("expiryDate");
    const dosageForm = drugAddForm.getFieldValue("dosageForm");
    const produceCountry = drugAddForm.getFieldValue("produceCountry");
    const content = drugAddForm.getFieldValue("content");
    const packing = drugAddForm.getFieldValue("packing");
    const drugInteraction = drugAddForm.getFieldValue("drugInteraction");
    const contraindication = drugAddForm.getFieldValue("contraindication");
    const dosage = drugAddForm.getFieldValue("dosage");
    const usage = drugAddForm.getFieldValue("usage");
    const price = drugAddForm.getFieldValue("price");
    const drugGroupId = await getIdFromDrugGroupName(drugGroupName);
    const lstUnitId = selectedUnitIds;
    /*
    console.log(name);
    console.log(activeSubstance);
    console.log(dosageForm);
    console.log(produceCountry);
    console.log(content);
    console.log(packing);
    console.log(drugInteraction);
    console.log(contraindication);
    console.log(price);
    console.log(dosage);
    console.log(usage);
    console.log(drugGroupId);
    console.log(lstUnitId);
    console.log(expiryDate);
     */
    if (
      !name ||
      !activeSubstance ||
      !expiryDate ||
      !dosageForm ||
      !content ||
      !packing ||
      !drugInteraction ||
      !contraindication ||
      !drugGroupId
    ) {
      notification.error({
        message: "Vui lòng nhập đầy đủ thông tin thuốc",
      });
      return;
    }
    try {
      const response = await axios.post(
        drug.create,
        {
          name,
          activeSubstance,
          expiryDate,
          dosageForm,
          produceCountry,
          content,
          packing,
          drugInteraction,
          dosage,
          usage,
          contraindication,
          price,
          drugGroupId,
          lstUnitId,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      console.log("User added successfully:", response);
      fetchData();
      setAddDrugModalVisible(false);
      notification.open({
        message: "Thêm thuốc thành công!",
        style: {
          backgroundColor: "#008CBA", // Green background
          color: "#ffffff", // White text
        },
      });
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm thuốc",
        style: {
          backgroundColor: "#ff4d4d", // Red background
          color: "#ffffff", // White text
        },
      });
    }
  };
  const handleCancel = () => {
    DrugGroupModalVisible
      ? setDrugGroupModalVisible(false)
      : setAddDrugModalVisible(false);

    setDeleteModalVisible(false);
  };
  const openAddDrugGroupForm = () => {
    setDrugGroupModalVisible(true);
    setModalModeDrugGroupForm("add");
  };
  const openAddDrugForm = (categoryName) => {
    setModalModeDrugForm("add");
    drugAddForm.resetFields();
    setDrugGroupName(categoryName);
    setAddDrugModalVisible(true);
  };
  const openDrugUpdateForm = (record) => {
    setModalModeDrugForm("edit");
    drugAddForm.setFieldsValue({
      name: record.name,
      activeSubstance: record.activeSubstance,
      dosageForm: record.dosageForm,
      price: record.price,
      registrationNumber: record.registrationNumber,
      drugInteraction: record.drugInteraction,
      contraindication: record.contraindication,
      price: record.price,
      usage: record.usage,
      dosage: record.dosage,
      produceCountry: record.produceCountry,
      expiryDate: moment(record.expiryDate, "YYYY-MM-DD"),
      content: record.content,
      packing: record.packing,
      lstUnitId: record.unitName,
      drugStatus: record.drugStatus,
    });
    setSelectedRecord(record);
    setAddDrugModalVisible(true);
  };
  const openDeleteDrugGroupForm = (categoryName) => {
    setModalModeDelete("drugGroup");
    setDrugGroupName(categoryName);
    setDeleteModalVisible(true);
  };
  const handleDrugUpdate = async () => {
    const name = drugAddForm.getFieldValue("name");
    const drugInteraction = drugAddForm.getFieldValue("drugInteraction");
    const contraindication = drugAddForm.getFieldValue("contraindication");
    const price = drugAddForm.getFieldValue("price");
    const usage = drugAddForm.getFieldValue("usage");
    const dosage = drugAddForm.getFieldValue("dosage");
    const unitName = drugAddForm.getFieldValue("lstUnitId");
    const unitId = lstUnit.find((unit) => unit.name === unitName);

    try {
      const response = await axios.put(
        `${drug.update}?id=${selectedRecord.id}`,
        {
          name,
          drugInteraction,
          contraindication,
          price,
          usage,
          dosage,
          unitId,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      fetchData();
      setAddDrugModalVisible(false);
      notification.info({
        message: "Cập nhật thuốc thành công",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi cập nhật thuốc",
      });
    }
  };
  const openDrugDeleteForm = (record) => {
    setModalModeDelete("drug");
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };
  const handleDeleteDrug = async () => {
    try {
      await axios.put(`${drug.switchStatus}?drugId=${selectedRecord.id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      fetchData();
      setModalModeDelete(false);
      notification.info({
        message: "Chuyển trạng thái thuốc thành công",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi chuyển trạng thái thuốc",
      });
    }
  };
  console.log(drugGroupName);
  const columns = [
    {
      title: <span style={{ color: "blue" }}>STT</span>,
      dataIndex: "stt",
      key: "stt",
      width: 50,
    },
    {
      title: <span style={{ color: "blue" }}>Tên thuốc</span>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <span style={{ color: "blue" }}>Mã thuốc</span>,
      dataIndex: "code",
      key: "code",
    },
    {
      title: <span style={{ color: "blue" }}>Số đăng kí</span>,
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: <span style={{ color: "blue" }}>ĐVT</span>,
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: <span style={{ color: "blue" }}>Cách dùng</span>,
      dataIndex: "usage",
      key: "usage",
    },
    {
      title: <span style={{ color: "blue" }}>Dạng bào chế</span>,
      dataIndex: "dosageForm",
      key: "dosageForm",
    },
    {
      title: <span style={{ color: "blue" }}>Hoạt chất</span>,
      dataIndex: "activeSubstance",
      key: "activeSubstance",
    },
    {
      title: <span style={{ color: "blue" }}>Giá thuốc</span>,
      dataIndex: "price",
      key: "price",
    },
    {
      title: <span style={{ color: "blue" }}>Nước sản xuất</span>,
      dataIndex: "produceCountry",
      key: "produceCountry",
    },

    {
      title: <span style={{ color: "blue" }}>Thao tác</span>,
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            onClick={() => openDrugUpdateForm(record)}
          />
          <Button
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => openDrugDeleteForm(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={cx("App")}>
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
          Quản lý Danh mục thuốc
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
            placeholder="Tìm kiếm theo tên thuốc"
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
          <Button type="primary" onClick={openAddDrugGroupForm}>
            Thêm danh mục thuốc
          </Button>
        </div>
      </div>
      <Modal
        title={
          modalModeDrugGroupForm === "add"
            ? "Thêm danh mục thuốc"
            : "Cập nhật danh mục thuốc"
        }
        visible={DrugGroupModalVisible}
        onOk={
          modalModeDrugGroupForm === "add"
            ? handleAddDrugGroup
            : handleUpdateDrugGroup
        }
        onCancel={handleCancel}
        form={form}
      >
        <Form form={form}>
          {modalModeDrugGroupForm === "add" ? (
            <div>
              <Form.Item
                label="Tên danh mục thuốc"
                name="drugGroupName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên danh mục thuốc",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          ) : (
            <div>
              <Form.Item
                label="Tên danh mục thuốc"
                name="drugGroupName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên danh mục thuốc",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </div>
          )}
          <Form.Item
            label="Mô tả danh mục thuốc"
            name="drugGroupDescribe"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả danh mục thuốc" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          modalModeDrugForm === "add"
            ? "Thêm thuốc"
            : "Cập nhật thông tin thuốc"
        }
        visible={addDrugModalVisible}
        onCancel={handleCancel}
        onOk={modalModeDrugForm === "add" ? handleAddDrug : handleDrugUpdate}
        form={drugAddForm}
      >
        <Form form={drugAddForm}>
          <Form.Item label="Tên thuốc" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Hoạt chất" name="activeSubstance">
            <Input />
          </Form.Item>
          <Form.Item label="Hạn sử dụng" name="expiryDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Dạng bào chế" name="dosageForm">
            <Input />
          </Form.Item>
          <Form.Item label="Quốc gia sản xuất " name="produceCountry">
            <Input />
          </Form.Item>
          <Form.Item label="Hàm lượng" name="content">
            <Input />
          </Form.Item>
          <Form.Item label="Quy cách đóng gói" name="packing">
            <Input />
          </Form.Item>
          <Form.Item label="Tương tác thuốc" name="drugInteraction">
            <Input />
          </Form.Item>
          <Form.Item label="Chống chỉ định" name="contraindication">
            <Input />
          </Form.Item>
          <Form.Item label="Liều dùng" name="dosage">
            <Input />
          </Form.Item>
          <Form.Item label="Cách dùng" name="usage">
            <Input />
          </Form.Item>
          <Form.Item label="Giá thuốc" name="price">
            <Input />
          </Form.Item>
          {modalModeDrugForm === "edit" ? (
            <div>
              <Form.Item label="Trạng thái" name="drugStatus">
                <Input />
              </Form.Item>
            </div>
          ) : (
            <div></div>
          )}
          <Form.Item label="Đơn vị tính" name="lstUnitId">
            <Select
              placeholder="Chọn đơn vị tính"
              mode="multiple"
              value={selectedUnitIds}
              onChange={handleUnitChange}
            >
              {lstUnit.map((unit) => (
                <Option key={unit.id} value={unit.id}>
                  {unit.unitName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        onOk={
          modalModeDelete === "drugGroup"
            ? handleDeleteDrugGroup
            : handleDeleteDrug
        }
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p style={{ fontSize: "20px", color: "blue" }}>
          Bạn có chắc chắn muốn xóa ?
        </p>
      </Modal>
      <Collapse accordion>
        {(filterData.length > 0 ? filterData : data).map((category, index) => {
          const categoryName = Object.keys(category)[0];
          const drugs = category[categoryName];

          const filteredDrugs = drugs.filter((drug) => !isEmptyDrug(drug));
          const processedData = drugs.map((drug, drugIndex) => ({
            key: `${index}-${drugIndex}`,
            stt: drugIndex + 1,
            ...drug,
          }));

          return (
            <Panel
              header={
                <div className={cx("panelHeader")}>
                  <span className={cx("categoryNameText")}>
                    {`${categoryName} (${filteredDrugs.length})`}
                  </span>
                  <div className={cx("buttons")}>
                    <Space size="small">
                      <Button
                        className={cx("button")}
                        icon={<FontAwesomeIcon icon={faSquarePlus} />}
                        onClick={() => openAddDrugForm(categoryName)}
                      />
                      <Button
                        className={cx("button")}
                        icon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => openUpdateDrugGroupForm(categoryName)}
                        disabled={filteredDrugs.length > 0}
                      />
                      <Button
                        className={cx("button")}
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => openDeleteDrugGroupForm(categoryName)}
                        disabled={filteredDrugs.length > 0}
                      />
                    </Space>
                  </div>
                </div>
              }
              key={index}
              className={cx("panel")}
            >
              <Table
                columns={columns}
                dataSource={processedData}
                pagination={true}
              />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};
export default Drug;

import { useEffect, useState } from "react";
import requestReceipt from "../../api/requestReceipt";
import {
  Table,
  Col,
  Row,
  Input,
  Space,
  DatePicker,
  Button,
  Select,
  Collapse,
  Pagination,
  Modal,
  Form,
  notification,
} from "antd";
import { Header } from "antd/es/layout/layout";
import classNames from "classnames/bind";
import style from "./RequestReceipt.module.css";
import axios from "axios";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";
import { v4 } from "uuid";
import drug from "../../api/drug";
import unit from "../../api/unit";

export const listStatus = [
  {
    name: "Tất cả",
    value: "ALL",
  },
  {
    name: "Chờ xác nhận",
    value: "PROCESSING",
  },
  {
    name: "Đã hủy",
    value: "CANCELED",
  },
  {
    name: "Đã xác nhận",
    value: "COMPLETE",
  },
];
const medicineColumns = [
  {
    title: <span style={{ color: "blue" }}>Mã sản phẩm</span>,
    dataIndex: "drugCode",
    key: "drugCode",
  },
  {
    title: <span style={{ color: "blue" }}>Tên sản phẩm</span>,
    dataIndex: "drugName",
    key: "drugName",
  },
  {
    title: <span style={{ color: "blue" }}>Hạn sử dụng</span>,
    dataIndex: "expiryDate",
    key: "expiryDate",
  },
  {
    title: <span style={{ color: "blue" }}>Đơn vị tính</span>,
    dataIndex: "unitName",
    key: "unitName",
  },
  {
    title: <span style={{ color: "blue" }}>Số lượng</span>,
    dataIndex: "quantity",
    key: "quantity",
  },
];

const RequestReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const cx = classNames.bind(style);
  const auth = getTokenFromLocalStorage();
  const { RangePicker } = DatePicker;
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const Option = { Select };
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataDetail, setDataDetail] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [listDrugFromInventory, setListDrugFromInventory] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const { Panel } = Collapse;
  const [requestReceiptForm] = Form.useForm();
  const [formSections, setFormSections] = useState([
    {
      key: v4(),
      drugId: "",
      quantity: 0,
      unitId: "",
    },
  ]);

  const checkRolePhamarcyDepartment = () => {
    const authData = localStorage.getItem("token");
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      return parsedAuthData.roles.includes("ROLE_DEPARTMENT_PHARMACY_MANAGER");
    }
  };
  useEffect(() => {
    fetchData();
    getListDrugFromInventory();
    getListUnitIdNameCvrRule();
  }, []);
  // lấy danh sách thuốc nhập
  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get(requestReceipt.getList, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });

      setData(response.data);
      // Lưu dữ liệu từ API vào state
      // Đã nhận dữ liệu, tắt trạng thái loading
    } catch (error) {
      console.error("Error fetching data:", error);
      // Đã xảy ra lỗi, tắt trạng thái loading
    } finally {
      setLoading(false);
    }
  };

  const selectColorStatus = (status) => {
    if (status === "Chờ xác nhận") return "#1E1E1E";
    if (status === "Đã xác nhận") return "#2227D6";
    if (status === "Đã hủy") return "#f22b2b";
  };
  // thêm form
  const addFormSection = () => {
    setFormSections([
      ...formSections,
      {
        key: v4(),
        drugId: "",
        quantity: 0,
        unitId: "",
      },
    ]);
  };
  // lấy dữ liệu từ các form
  const getFormSectionsData = () => {
    return formSections.map((section) => ({
      drugId: section.drugId,
      quantity: section.quantity,
      unitId: section.unitId,
    }));
  };
  console.log(getFormSectionsData());
  // lấy danh sách thuốc id , code, name
  const getListDrugFromInventory = async () => {
    try {
      const response = await axios.get(
        requestReceipt.getListDrugFromInventory,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setListDrugFromInventory(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách thuốc id code name");
    }
  };
  // lấy danh sách đơn vị tính id name ..
  const getListUnitIdNameCvrRule = async () => {
    try {
      const response = await axios.get(unit.getList);
      setListUnit(response.data);
    } catch (error) {
      console.error("Error fetching unit:", error);
    }
  };
  const handleExportPdf = async (item) => {
    try {
      const response = await axios.get(
        `${requestReceipt.getListDrug}?id=${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      const receiptDetails = response.data;
      let htmlContent = `
      <html>
        <head>
          <title>Import Receipt</title>
          <style>
            body {
              font-family: TimesNewRoman, sans-serif;
            }
            h1, h2, h3, p {
              margin-bottom: 20px;
              padding: 0;
            }
            h4 {
              margin-left: 450px
            }
            .container {
              width: 100%;
              margin: 0 auto;
              padding: 20px;
            }
            .header .row {
              display: flex;
              justify-content: space-between;
            }
            .header .row p {
              margin-right: 30px;
              padding: 5px 0;
            }
            .header, .content {
              margin-bottom: 20px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
            }
            .table th, .table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .table th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 >Thông tin phiếu yêu cầu thuốc</h1>
              <div class="row">
                <p>Mã Phiếu: ${item.requestReceiptCode}</p>
                <p>Ngày yêu cầu: ${item.requestDate}</p>
              </div>
              <div class="row">
                <p>Người tạo: ${item.creatorName}</p>
                <p>Khoa bộ phận: ${item.departmentName} <p>
                <p>Trạng thái: ${item.requestStatus}</p>
                
              </div>
            </div>
            <div class="content">
              <table class="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Mã sản phẩm</th>
                    <th>Hạn sử dụng</th>
                    <th>Số lượng</th>
                    <th>Đơn vị tính</th>
                    <th>Ghi chú<th>
                    
                  </tr>
                </thead>
                <tbody>
                  ${receiptDetails.map(
                    (detail, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${detail.drugName}</td>
                      <td>${detail.drugCode}</td>
                      <td>${detail.expiryDate}</td>
                      <td>${detail.quantity}</td>
                      <td>${detail.unitName}</td>
                      <td></td>
                    </tr>
                  `
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </body>
      </html>
    `;
      const printWindow = window.open("", "_blank", "width=800,height=600");
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách thuốc");
    }
  };
  const handleChange = (key, field, value) => {
    const actualValue = value?.target?.value ?? value;
    const updatedSections = formSections.map((section) => {
      if (section.key === key) {
        return { ...section, [field]: actualValue };
      }
      return section;
    });
    setFormSections(updatedSections);
  };

  const onChangeDate = (dates, dateStrings) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      setStartDate("1970-01-01");
      setEndDate("1970-01-01");
    }
  };
  const handleSearch = async () => {
    try {
      if (
        searchText.trim !== "" ||
        (startDate & endDate) !== "" ||
        selectedStatus !== ""
      ) {
        setCurrentPage(1);
        const response = await axios.get(requestReceipt.getList, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          params: {
            requestCode: searchText,
            startDate: startDate,
            endDate: endDate,
            status: selectedStatus,
          },
        });

        setData(response.data);
      } else {
        fetchData();
      }
    } catch (error) {
      console.log("Có lỗi khi tìm kiếm");
    }
  };
  const openAddRequestReceiptForm = () => {
    setModalVisible(true);
  };
  const hanldeAddRequestReceipt = async () => {
    try {
      const response = await axios.post(
        requestReceipt.create,
        {
          drugDTOS: getFormSectionsData(),
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      fetchData();
      setModalVisible(false);
      notification.info({
        message: "Thêm phiếu yêu cầu thuốc thành công!",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi thêm phiếu yêu cầu thuốc",
      });
    }
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };
  const handleConfirmRequestReceipt = async (id) => {
    try {
      await axios.get(requestReceipt.confirmRequest, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },

        params: {
          id: id,
        },
      });
      fetchData();
      notification.info({
        message: "Đã phê duyệt phiếu!",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi phê duyệt!",
      });
      console.log(error);
    }
  };
  const handleRejectRequestReceipt = async (id) => {
    try {
      await axios.get(requestReceipt.rejectRequest, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },

        params: {
          id: id,
        },
      });
      fetchData();
      notification.info({
        message: "Đã hủy bỏ phiếu!",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi hủy phiếu",
      });
      console.log(error);
    }
  };
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handlePanelChange = (key) => {
    getDataDetail(key);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // hàm xóa form
  const handleDeleteForm = (key) => {
    const updatedSections = formSections.filter(
      (section) => section.key !== key
    );
    setFormSections(updatedSections);
  };
  const getDataDetail = async (id) => {
    try {
      const response = await axios.get(
        `${requestReceipt.getListDrug}?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      setDataDetail((prevDataDetail) => ({
        ...prevDataDetail,
        [id]: response.data,
      }));
    } catch (error) {
      console.log("Error fetch detail data");
      return null;
    }
  };
  return (
    <div className={cx("container")}>
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
          Quản lý yêu cầu thuốc
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
            placeholder="Tìm kiếm theo mã phiếu"
            style={{ marginRight: "10px", width: "400px" }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            style={{ width: 150 }}
            onChange={handleStatusChange}
            placeholder="Chọn trạng thái"
          >
            {listStatus.map((status) => (
              <Option key={status.value} value={status.value}>
                {status.name}
              </Option>
            ))}
          </Select>
          <Space size={15} style={{ marginRight: "10px" }}>
            {" "}
            <RangePicker onChange={onChangeDate} />
          </Space>

          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginRight: "20px" }}
          >
            Tìm kiếm
          </Button>
          <Button type="primary" onClick={openAddRequestReceiptForm}>
            Thêm phiếu yêu cầu thuốc
          </Button>
        </div>
      </div>
      <Header className={cx("header")}>
        <Row>
          <Col span={4} className={cx("code-text")}>
            {" "}
            <span> Mã Phiếu </span>{" "}
          </Col>
          <Col span={4}>
            {" "}
            <span className={cx("date-text")}> Ngày tạo yêu cầu </span>{" "}
          </Col>
          <Col span={4}>
            {" "}
            <span className={cx("created-text")}> Người tạo phiếu </span>{" "}
          </Col>
          <Col span={4}>
            {" "}
            <span className={cx("department-text")}> Khoa-Bộ phận </span>{" "}
          </Col>
          <Col span={3}>
            {" "}
            <span className={cx("status-text")}> Trạng thái </span>{" "}
          </Col>
          {localStorage.getItem}
        </Row>
      </Header>
      <Modal
        visible={modalVisible}
        onOk={hanldeAddRequestReceipt}
        onCancel={handleCancel}
        width={1200}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#2227D6",
            }}
          >
            <h2 style={{ margin: 0 }}>Tạo phiếu yêu cầu thuốc</h2>
          </div>
        }
      >
        <h3 style={{ marginBottom: "10px" }}>Danh sách sản phẩm</h3>
        <div className={cx("form")}>
          <Form form={requestReceiptForm} layout="vertical">
            {formSections.map((section) => (
              <div key={section.key} style={{ marginBottom: "30px" }}>
                <Row gutter={16}>
                  <Col span={9}>
                    <Form.Item label="Tên sản phẩm">
                      <Select
                        showSearch
                        placeholder="Tìm kiếm sản phẩm"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.children ?? "")
                            .toLowerCase()
                            .localeCompare(
                              (optionB?.children ?? "").toLowerCase()
                            )
                        }
                        onChange={(value) =>
                          handleChange(section.key, "drugId", value)
                        }
                      >
                        {listDrugFromInventory.map((importReceipt) => (
                          <Option
                            key={importReceipt.id}
                            value={importReceipt.id}
                          >
                            {importReceipt.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Mã sản phẩm">
                      <span>
                        {
                          listDrugFromInventory.find(
                            (item) => item.id === section.drugId
                          )?.code
                        }
                      </span>
                    </Form.Item>
                  </Col>

                  <Col span={3}>
                    <Form.Item label="Số lượng">
                      <Input
                        type="number"
                        onChange={(e) =>
                          handleChange(section.key, "quantity", e)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Đơn vị tính">
                      <Select
                        onChange={(value) =>
                          handleChange(section.key, "unitId", value)
                        }
                      >
                        {listUnit.map((unit) => (
                          <Option key={unit.id} value={unit.id}>
                            {unit.unitName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <div style={{ marginLeft: "50px" }}>
                    <Button
                      style={{ marginTop: "30px" }}
                      icon={
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleDeleteForm(section.key)}
                        />
                      }
                    ></Button>
                  </div>
                </Row>
              </div>
            ))}

            <Button
              icon={<FontAwesomeIcon icon={faPlus} />}
              style={{ color: "#2227D6" }}
              onClick={addFormSection}
            >
              Thêm sản phẩm
            </Button>
          </Form>
        </div>
      </Modal>
      <div>
        {paginatedData.map((item) => (
          <Collapse
            accordion
            className={cx("collapse")}
            onChange={() => handlePanelChange(item.id)}
            key={item.id}
          >
            <Panel
              header={
                <div>
                  <Row>
                    <Col span={3}>
                      <span
                        className={cx("panel-text")}
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        {item.requestReceiptCode}
                      </span>{" "}
                    </Col>
                    <Col span={5}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.requestDate}
                      </span>{" "}
                    </Col>
                    <Col span={3}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.creatorName}
                      </span>{" "}
                    </Col>

                    <Col span={6}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.departmentName}
                      </span>{" "}
                    </Col>

                    <Col span={2}>
                      {" "}
                      <span
                        className={cx("panel-text")}
                        style={{ color: selectColorStatus(item.requestStatus) }}
                      >
                        {item.requestStatus}
                      </span>{" "}
                    </Col>
                    <Col span={3}>
                      <Space size="middle">
                        {item.requestStatus === "Chờ xác nhận" &&
                        checkRolePhamarcyDepartment() ? (
                          <span>
                            <Button
                              type="primary"
                              style={{ backgroundColor: "#259fea" }}
                              onClick={() =>
                                handleConfirmRequestReceipt(item.id)
                              }
                            >
                              Phê duyệt
                            </Button>
                            <Button
                              style={{
                                backgroundColor: "#ea333f",
                                marginLeft: "10px",
                              }}
                              type="primary"
                              onClick={() =>
                                handleRejectRequestReceipt(item.id)
                              }
                            >
                              Từ chối
                            </Button>
                          </span>
                        ) : (
                          <></>
                        )}
                      </Space>
                    </Col>
                    <Col span={2}>
                      <Button
                        icon={
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            onClick={() => handleExportPdf(item)}
                          />
                        }
                      />
                    </Col>
                  </Row>
                </div>
              }
              className={cx("panel")}
              pagination
            >
              <Table
                columns={medicineColumns}
                dataSource={dataDetail[item.id] || []}
                pagination={false}
              />
            </Panel>
          </Collapse>
        ))}
        <div className={cx("pagination")}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};
export default RequestReceipt;

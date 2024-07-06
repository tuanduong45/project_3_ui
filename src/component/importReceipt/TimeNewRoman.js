import React, { useEffect, useState } from "react";
import importReceipt from "../../api/importReceipt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";
import axios from "axios";
import { v4 } from "uuid";
import {
  Space,
  Button,
  Collapse,
  Table,
  Col,
  Row,
  Pagination,
  Input,
  DatePicker,
  Form,
  Select,
  Modal,
  notification,
} from "antd";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import classNames from "classnames/bind";
import style from "./ImportReceipt.module.css";
import { Header } from "antd/es/layout/layout";
import drug from "../../api/drug";
import unit from "../../api/unit";
import supplier from "../../api/supplier";
import moment from "moment";

import "jspdf-autotable";

const ImportReceipt = () => {
  const cx = classNames.bind(style);
  const { Panel } = Collapse;
  const auth = getTokenFromLocalStorage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [listDrugIdCodeName, setListDrugIdCodeName] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [listSupplier, setListSupplier] = useState([]);
  const [formSections, setFormSections] = useState([
    {
      key: v4(),
      drugId: "",
      supplierId: "",
      produceBatchNumber: "",
      expiryDate: null,
      quantity: 0,
      unitId: "",
      price: 0,
      totalPrice: 0,
    },
  ]);

  const { RangePicker } = DatePicker;
  const pageSize = 10;
  const Option = { Select };
  const [importReceiptForm] = Form.useForm();

  useEffect(() => {
    fetchData();
    getListDrug();
    getListUnitIdNameCvrRule();
    getListSupplierIdTaxCodeName();
  }, []);

  // lấy danh sách thuốc id, code,name
  const getListDrug = async () => {
    try {
      const response = await axios.get(drug.getCommonIdCodeName, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setListDrugIdCodeName(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách thuốc id code name");
    }
  };
  // lấy danh sách đơn vị tính id , name , quy tắc chuyển đổi
  const getListUnitIdNameCvrRule = async () => {
    try {
      const response = await axios.get(unit.getList);
      setListUnit(response.data);
    } catch (error) {
      console.error("Error fetching unit:", error);
    }
  };
  // lấy danh sách nhà cung cấp id tax code name
  const getListSupplierIdTaxCodeName = async () => {
    try {
      const response = await axios.get(supplier.getListIdTaxCodeName, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setListSupplier(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách nhà cung cấp");
    }
  };
  // thêm form
  const addFormSection = () => {
    setFormSections([
      ...formSections,
      {
        key: v4(),
        drugId: "",
        supplierId: "",
        produceBatchNumber: "",
        expiryDate: null,
        quantity: 0,
        unitId: "",
        price: 0,
        total: 0,
      },
    ]);
  };
  // lưu sự thay đổi của các trường
  const handleChange = (key, field, value) => {
    const actualValue = value?.target?.value ?? value;
    const updatedSections = formSections.map((section) => {
      if (section.key === key) {
        const newSection = { ...section, [field]: actualValue };
        if (field === "quantity" || field === "price") {
          const quantity =
            field === "quantity" ? parseFloat(actualValue) : section.quantity;
          const price =
            field === "price" ? parseFloat(actualValue) : section.price;
          newSection.totalPrice = quantity * price;
        }
        if (field === "expiryDate") {
          newSection.expiryDate = value
            ? moment(value).format("YYYY-MM-DD")
            : null;
        }
        return newSection;
      }
      return section;
    });
    setFormSections(updatedSections);
  };

  // lấy dữ liệu từ các form
  const getFormSectionsData = () => {
    return formSections.map((section) => ({
      drugId: section.drugId,
      produceBatchNumber: section.produceBatchNumber,
      expiryDate: section.expiryDate,
      quantity: section.quantity,
      unitId: section.unitId,
      price: section.price,
      supplierId: section.supplierId,
    }));
  };

  // hàm xóa form
  const handleDeleteForm = (key) => {
    const updatedSections = formSections.filter(
      (section) => section.key !== key
    );
    setFormSections(updatedSections);
  };

  // gọi fetchData khi searchtext và startDate và endDate thay đổi
  useEffect(() => {
    handleSearch();
  }, [searchText, startDate, endDate]);

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
      title: <span style={{ color: "blue" }}>Nhà cung cấp</span>,
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: <span style={{ color: "blue" }}>Số lô sản xuất</span>,
      dataIndex: "produceBatchNumber",
      key: "produceBatchNumber",
    },
    {
      title: <span style={{ color: "blue" }}>Hạn sử dụng</span>,
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: <span style={{ color: "blue" }}>Số lượng</span>,
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: <span style={{ color: "blue" }}>Đơn vị tính</span>,
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: <span style={{ color: "blue" }}>Đơn giá</span>,
      dataIndex: "price",
      key: "price",
    },
    {
      title: <span style={{ color: "blue" }}>Thành tiền</span>,
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Thực hiện request để lấy dữ liệu từ API
      const response = await axios.get(importReceipt.list, {
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
  const hanldeAddImportReceipt = async () => {
    try {
      const response = await axios.post(
        importReceipt.create,
        { importReceiDetailDTOS: getFormSectionsData() },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      fetchData();
      setModalVisible(false);
      notification.info({
        message: "Thêm phiếu nhập kho thành công !",
      });
    } catch (error) {
      notification.error({
        message: "Có lỗi khi thêm phiếu nhập kho",
      });
    }
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSearch = async () => {
    try {
      if (searchText.trim !== "" || (startDate & endDate) !== "") {
        setCurrentPage(1);
        const response = await axios.get(importReceipt.list, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          params: {
            code: searchText,
            startDate: startDate,
            endDate: endDate,
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
  const openAddImportReceiptForm = () => {
    setModalMode("add");
    importReceiptForm.resetFields();
    setModalVisible(true);
  };

  const getDataDetail = async (id) => {
    try {
      const response = await axios.get(`${importReceipt.getDetail}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setDataDetail((prevDataDetail) => ({
        ...prevDataDetail,
        [id]: response.data,
      }));
    } catch (error) {
      console.log("Error fetch detail data");
      return null;
    }
  };
  const updateForm = Form.useForm();
  const openImportReceiptUpdateForm = async (id) => {
    try {
      const response = await axios.get(`${importReceipt.getDetail}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      console.log(response.data);
      const receiptDetails = response.data;
      receiptDetails.map((detail, index) => {
        updateForm.setFieldsValue({
          name: detail.drugName,
          supplier: detail.supplierName,
          produceBatchNumber: detail.produceBatchNumber,
          expiryDate: moment(detail.expiryDate, "YYYY-MM-DD"),
          quantity: detail.quantity,
          price: detail.price,
          unit: detail.unitName,
          total: detail.totalAmount,
        });
      });

      setModalMode("edit");
      setModalVisible(true);
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách thuốc theo id ");
    }
  };
  const handleExportPdf = async (item) => {
    // lấy danh sách thuốc theo import receipt id
    try {
      const response = await axios.get(
        `${importReceipt.getDetail}?id=${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      const receiptDetails = response.data;
      const totalAmount = receiptDetails.reduce(
        (sum, detail) => sum + detail.totalAmount,
        0
      );
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
              <h1 >Thông tin phiếu nhập kho</h1>
              <div class="row">
                <p>Mã Phiếu: ${item.importReceiptCode}</p>
                <p>Ngày nhập kho: ${item.importDate}</p>
              </div>
              <div class="row">
                <p>Người nhập kho: ${item.createdBy}</p>
                <p>Trạng thái: ${item.statusText}</p>
              </div>
            </div>
            <div class="content">
              <table class="table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Nhà cung cấp</th>
                    <th>Số lô sản xuất</th>
                    <th>Hạn sử dụng</th>
                    <th>Số lượng</th>
                    <th>Đơn vị tính</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${receiptDetails
                    .map(
                      (detail) => `
                    <tr>
                      <td>${detail.drugName}</td>
                      <td>${detail.supplierName}</td>
                      <td>${detail.produceBatchNumber}</td>
                      <td>${detail.expiryDate}</td>
                      <td>${detail.quantity}</td>
                      <td>${detail.unitName}</td>
                      <td>${detail.price.toLocaleString("vi-VN")}</td>
                      <td>${detail.totalAmount.toLocaleString("vi-VN")}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
              <h4>Tổng tiền : ${totalAmount.toLocaleString("vi-VN")}</h4>
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
  const openImportReceiptDeleteForm = () => {};
  const handlePanelChange = (key) => {
    getDataDetail(key);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          Quản lý nhập kho
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
          <Button type="primary" onClick={openAddImportReceiptForm}>
            Thêm phiếu nhập kho
          </Button>
        </div>
      </div>
      <Header className={cx("header")}>
        <Row>
          <Col span={5} className={cx("code-text")}>
            {" "}
            <span> Mã Phiếu </span>{" "}
          </Col>
          <Col span={5}>
            {" "}
            <span className={cx("import-text")}> Ngày nhập kho </span>{" "}
          </Col>
          <Col span={5}>
            {" "}
            <span className={cx("created-text")}> Người nhập kho </span>{" "}
          </Col>
          <Col span={5}>
            {" "}
            <span className={cx("status-text")}> Trạng thái </span>{" "}
          </Col>
        </Row>
      </Header>
      <Modal
        visible={modalVisible}
        onOk={hanldeAddImportReceipt}
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
            {modalMode === "add" ? (
              <h2 style={{ margin: 0 }}>Tạo phiếu nhập kho</h2>
            ) : (
              <h2 style={{ margin: 0 }}>Cập nhật phiếu nhập kho</h2>
            )}
          </div>
        }
      >
        <h3 style={{ marginBottom: "10px" }}>Danh sách sản phẩm</h3>
        <div className={cx("form")}>
          <Form form={importReceiptForm} layout="vertical">
            {formSections.map((section) => (
              <div key={section.key} style={{ marginBottom: "30px" }}>
                <Row gutter={16}>
                  <Col span={9}>
                    <Form.Item label="Tên sản phẩm" name="name">
                      <Select
                        onChange={(value) =>
                          handleChange(section.key, "drugId", value)
                        }
                      >
                        {listDrugIdCodeName.map((importReceipt) => (
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
                  <Col span={6}>
                    <Form.Item label="Mã sản phẩm">
                      <span>
                        {
                          listDrugIdCodeName.find(
                            (item) => item.id === section.drugId
                          )?.code
                        }
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={9}>
                    <Form.Item label="Nhà cung cấp" name="supplier">
                      <Select
                        onChange={(value) =>
                          handleChange(section.key, "supplierId", value)
                        }
                      >
                        {listSupplier.map((supplier) => (
                          <Option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={4.5}>
                    <Form.Item label="Số lô sản xuất" name="produceBatchNumber">
                      <Input
                        onChange={(e) =>
                          handleChange(section.key, "produceBatchNumber", e)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Hạn sử dụng" name="expiryDate">
                      <DatePicker
                        onChange={(date) =>
                          handleChange(section.key, "expiryDate", date)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Số lượng" name="quantity">
                      <Input
                        type="number"
                        onChange={(e) =>
                          handleChange(section.key, "quantity", e)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Đơn vị tính" name="unit">
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
                  <Col span={3}>
                    <Form.Item label="Đơn giá" name="price">
                      <Input
                        type="number"
                        onChange={(e) =>
                          handleChange(
                            section.key,
                            "price",
                            e.toLocaleString("vi-VN")
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Thành tiền" name="total">
                      <Input readOnly value={section.totalPrice} />
                    </Form.Item>
                  </Col>
                  <div style={{ marginLeft: "50px" }}>
                    <Button
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
                    <Col span={5}>
                      <span
                        className={cx("panel-text")}
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        {item.importReceiptCode}
                      </span>{" "}
                    </Col>
                    <Col span={5}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.importDate}
                      </span>{" "}
                    </Col>
                    <Col span={5}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.createdBy}
                      </span>{" "}
                    </Col>

                    <Col span={5}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.statusText}
                      </span>{" "}
                    </Col>
                    <Col span={4}>
                      <Space size="middle">
                        <Button
                          icon={<FontAwesomeIcon icon={faPenToSquare} />}
                          onClick={() => openImportReceiptUpdateForm(item.id)}
                        />
                        <Button
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          onClick={() => openImportReceiptDeleteForm()}
                        />
                        <Button
                          icon={<FontAwesomeIcon icon={faFilePdf} />}
                          onClick={() => handleExportPdf(item)}
                        />
                      </Space>
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
export default ImportReceipt;

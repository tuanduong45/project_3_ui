import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
import axios from "axios";
import inventory from "../../api/inventory";
import { useEffect, useState } from "react";
import style from "./Inventory.module.css";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import {
  Input,
  Panel,
  Button,
  Row,
  Col,
  Table,
  Pagination,
  Collapse,
  Space,
  Modal,
  Form,
  notification,
} from "antd";
import { Header } from "antd/es/layout/layout";

const Inventory = () => {
  const { Panel } = Collapse;
  const auth = getTokenFromLocalStorage();
  const cx = classNames.bind(style);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataDetail, setDataDetail] = useState({});
  const [listDataDetail, setListDataDetail] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemCurrent, setItemCurrent] = useState([]);
  const [batchExpiryList, setBatchExpiryList] = useState([]);

  const pageSize = 12;
  const [form] = Form.useForm();
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (modalVisible) {
      setBatchExpiryList([]);
    }
  }, [modalVisible]);
  const fetchData = async () => {
    try {
      const response = await axios.get(inventory.getList, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách tồn kho");
    }
  };
  const getDataDetail = async (id) => {
    try {
      const response = await axios.get(`${inventory.getListDetail}?id=${id}`, {
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
  const handleChange = (produceBatchNumber, value) => {
    setBatchExpiryList((prevList) => {
      const newList = prevList.filter(
        (item) => item.produceBatchNumber !== produceBatchNumber
      );
      newList.push({ produceBatchNumber, expiryBeforeDay: value });
      return newList;
    });
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePanelChange = (key) => {
    getDataDetail(key);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleSearch = async () => {
    try {
      if (searchName.trim !== "" || searchCode.trim !== "") {
        setCurrentPage(1);
        const response = await axios.get(inventory.getList, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          params: {
            code: searchCode,
            name: searchName,
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

  const getListInventoryDetail = async (id) => {
    try {
      const response = await axios.get(`${inventory.getListDetail}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setListDataDetail(response.data);
    } catch (error) {
      console.log("Có lỗi khi lấy danh sách thuốc tồn kho theo id thuốc");
    }
  };

  const openWarnForm = (item) => {
    getListInventoryDetail(item.drugId);
    setItemCurrent(item);

    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const hanldeWarnDrug = async () => {
    try {
      const response = await axios.post(
        inventory.addDrugWarn,
        {
          drugId: itemCurrent.drugId,
          drugWarningDTOS: batchExpiryList,
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      notification.info({
        message: "Thêm cảnh báo thuốc thành công!",
      });
      setModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Có lỗi khi thêm cảnh báo thuốc!",
      });
    }
    console.log(batchExpiryList);
  };
  const medicineColumns = [
    {
      title: <span style={{ color: "blue" }}>Số lô sản xuất</span>,
      dataIndex: "produceBatchNumber",
      key: "produceBatchNumber",
    },
    {
      title: (
        <span style={{ color: "blue", marginRight: "110px" }}>Hạn sử dụng</span>
      ),
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: (
        <span style={{ color: "blue", marginRight: "20px" }}>
          Số lượng còn lại
        </span>
      ),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: <span style={{ color: "blue" }}>Đơn giá</span>,
      dataIndex: "price",
      key: "price",
    },
  ];

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
          Quản lý tồn kho
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
            placeholder="Tìm kiếm theo tên sản phẩm"
            style={{ marginRight: "10px", width: "400px" }}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            placeholder="Tìm kiếm theo mã sản phẩm"
            style={{ marginRight: "10px", width: "400px" }}
            onChange={(e) => setSearchCode(e.target.value)}
          />

          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginRight: "20px" }}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <Header className={cx("header")}>
        <Row>
          <Col span={3} className={cx("code-text")}>
            {" "}
            <span> Mã sản phẩm</span>{" "}
          </Col>
          <Col span={9}>
            {" "}
            <span className={cx("name-text")}> Tên sản phẩm</span>{" "}
          </Col>
          <Col span={8}>
            {" "}
            <span className={cx("total-text")}> Tổng số tồn kho </span>{" "}
          </Col>
        </Row>
      </Header>
      <Modal
        title={
          <span style={{ fontSize: "20px", color: "#224CDE" }}>
            Cài đặt cảnh báo thuốc
          </span>
        }
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={hanldeWarnDrug}
        width={"800px"}
        form={form}
      >
        <Form form={form}>
          <h1>Hệ thống cảnh báo thuốc khi</h1>
          {listDataDetail.map((item) => (
            <Row>
              <Col span={8}>
                <Form.Item
                  label={
                    <span style={{ fontWeight: "bold" }}>Số lô sản xuất</span>
                  }
                >
                  <Input readOnly value={item.produceBatchNumber} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span style={{ marginLeft: "50px", fontWeight: "bold" }}>
                      Hạn sử dụng còn (ngày)
                    </span>
                  }
                >
                  <Input
                    onChange={(e) =>
                      handleChange(item.produceBatchNumber, e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal>

      <div>
        {paginatedData.map((item) => (
          <Collapse
            accordion
            className={cx("collapse")}
            onChange={() => handlePanelChange(item.drugId)}
            key={item.drugId}
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
                        {item.code}
                      </span>{" "}
                    </Col>
                    <Col span={9}>
                      {" "}
                      <span className={cx("panel-text")}>{item.name}</span>{" "}
                    </Col>
                    <Col span={8}>
                      {" "}
                      <span className={cx("panel-text")}>
                        {item.totalQuantity + " " + item.unitName}
                      </span>{" "}
                    </Col>
                    <Col span={4}>
                      <Space>
                        <Button
                          icon={
                            <FontAwesomeIcon
                              icon={faBell}
                              onClick={() => openWarnForm(item)}
                            />
                          }
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
                dataSource={dataDetail[item.drugId] || []}
                columns={medicineColumns}
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
export default Inventory;

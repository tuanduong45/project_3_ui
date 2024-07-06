import { Row, Col, Space, Button } from "antd";
import ImportReport from "../../assets/ImportReportByMonth";
import RequestReceiptReport from "../../assets/RequestReceiptReportByMonth";
import SupplierReport from "../../assets/SupplierReportByDate";
import InventoryReport from "../../assets/InventoryReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import { icon } from "@fortawesome/fontawesome-svg-core";

const Chart = () => {
  return (
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <Row gutter={25}>
        <Col span={12}>
          <ImportReport />
        </Col>
        <Col span={12}>
          <RequestReceiptReport />
        </Col>
      </Row>
      <Row gutter={25}>
        <Col span={12}>
          <InventoryReport />
        </Col>
        <Col span={12}>
          <SupplierReport />
        </Col>
      </Row>
    </div>
  );
};
export default Chart;

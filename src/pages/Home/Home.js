import React, { useState } from "react";
import { HomeFilled } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules } from "@fortawesome/free-solid-svg-icons/faCapsules";
import { faTruckField } from "@fortawesome/free-solid-svg-icons";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons/faWarehouse";
import { faChartPie } from "@fortawesome/free-solid-svg-icons/faChartPie";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import style from "./Home.module.css";
import classNames from "classnames/bind";
import styled from "styled-components";
import Siderbar from "../../layout/defaultLayout/Sidebar/Siderbar";
import HeaderInfor from "../../layout/defaultLayout/Header/HeaderInfor";
import FooterInfor from "../../layout/defaultLayout/Footer/FooterInfor";
import routes from "../../config/router";
const CustomLyou = styled(Layout)`
  &.ant-layout .ant-layout-sider {
    background: #e1eef6;
  }
  &.ant-layout .ant-layout-sider-trigger {
    background: white;
    color: black;
  }
`;

const { Content } = Layout;
const cx = classNames.bind(style);
export const items = [
  {
    key: "1",
    icon: <HomeFilled />,
    label: "Trang chủ",
    path: routes.home,
  },
  {
    key: "2",
    icon: <HomeFilled />,
    label: "Quản lý khoa-bộ phận",
    path: routes.departmet,
  },
  {
    key: "3",
    icon: <FontAwesomeIcon icon={faUser} />,
    label: "Quản lý người dùng",
    path: routes.user,
  },
  {
    key: "4",
    icon: <FontAwesomeIcon icon={faCapsules} />,
    label: "Quản lý danh mục thuốc",
    path: routes.drug,
  },
  {
    key: "5",
    icon: <FontAwesomeIcon icon={faTruckField} />,
    label: "Quản lý nhà cung cấp",
    path: "/supplier",
  },
  {
    key: "sub1",
    icon: <FontAwesomeIcon icon={faWarehouse} />,
    label: "Quản lý kho hàng",
    children: [
      {
        key: "6",
        label: "Quản lý nhập kho",
        path: "/import",
      },
      {
        key: "7",
        label: "Quản lý tồn kho",
        path: "/inventory",
      },
      {
        key: "8",
        label: "Quản lý yêu cầu thuốc",
        path: "/request",
      },
    ],
  },
  {
    key: "9",
    icon: <FontAwesomeIcon icon={faChartPie} />,
    children: null,
    label: "Báo cáo thống kê",
    path: "/report",
  },
];
const Home = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <CustomLyou
      className={cx("layout")}
      style={{
        minHeight: "100vh",
        background: "#E1EEF6",
      }}
    >
      <Siderbar />
      <Layout className={cx("layout1")}>
        <HeaderInfor />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 860,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <FooterInfor />
      </Layout>
    </CustomLyou>
  );
};
export default Home;

import React, { useState } from "react";
import { HomeFilled } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules } from "@fortawesome/free-solid-svg-icons/faCapsules";
import { faTruckField } from "@fortawesome/free-solid-svg-icons";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons/faWarehouse";
import { faChartPie } from "@fortawesome/free-solid-svg-icons/faChartPie";
import { faHospital } from "@fortawesome/free-solid-svg-icons/faHospital";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import style from "./Home.module.css";
import classNames from "classnames/bind";
import styled from "styled-components";
import Department from "../../component/department/Department";
import User from "../../component/user/User";
import { Link, Route, Routes } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const CustomMenu = styled(Menu)`
  .ant-menu-item {
    height: 70px;
    color: black;
  }
  &.ant-menu {
    background: #e1eef6;
  }
  .ant-menu-submenu-title {
    height: 70px;
    color: black;
  }
`;

const CustomLyou = styled(Layout)`
  &.ant-layout .ant-layout-sider {
    background: #e1eef6;
  }
  &.ant-layout .ant-layout-sider-trigger {
    background: white;
    color: black;
  }
`;

const cx = classNames.bind(style);
const items = [
  {
    key: "1",
    icon: <HomeFilled />,
    children: null,
    label: "Trang chủ",
    path: "/home",
  },
  {
    key: "2",
    icon: <HomeFilled />,
    children: null,
    label: "Quản lý khoa-bộ phận",
    path: "/department",
  },
  {
    key: "3",
    icon: <FontAwesomeIcon icon={faUser} />,
    children: null,
    label: "Quản lý người dùng",
    path: "/user",
  },
  {
    key: "4",
    icon: <FontAwesomeIcon icon={faCapsules} />,
    children: null,
    label: "Quản lý danh mục thuốc",
    path: "/medicine",
  },
  {
    key: "5",
    icon: <FontAwesomeIcon icon={faTruckField} />,
    children: null,
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
const Home = () => {
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
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={300}
      >
        {collapsed ? (
          <></>
        ) : (
          <div className={cx("logo")}>
            <FontAwesomeIcon
              icon={faHospital}
              size="6x"
              style={{
                color: "#1059bf",
                marginTop: "20px",
              }}
            />
          </div>
        )}

        <CustomMenu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          className={cx("menu")}
        ></CustomMenu>
      </Sider>
      <Layout className={cx("layout1")}>
        <Header
          style={{
            padding: 0,
            background: "#87cefa1c",
          }}
          className={cx("header")}
        >
          <div className={cx("header-text")}>
            HỆ THỐNG QUẢN LÝ DƯỢC BỆNH VIỆN
          </div>
        </Header>
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
          ></div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#E1EEF6",
          }}
        ></Footer>
      </Layout>
    </CustomLyou>
  );
};
export default Home;

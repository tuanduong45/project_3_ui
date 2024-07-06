import style from "./Siderbar.module.css";
import classNames from "classnames/bind";
import styled from "styled-components";
import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-solid-svg-icons/faHospital";
import { Layout } from "antd";
import { SiderbarData } from "./SidebarData";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const CustomMenu = styled(Menu)`
  .ant-menu-item {
    height: 70px;
    color: black;
    margin-bottom: 15px;
  }
  &.ant-menu {
    background: #e1eef6;
  }
  .ant-menu-submenu-title {
    height: 90px;
    color: black;
    margin-right: 10px;
  }
  .ant-menu-title-content {
    position: absolute;
  }
  .anticon anticon-home {
    margin-right: 30px; /* Khoảng cách giữa biểu tượng và nhãn */
  }
  .ant-menu-submenu ant-menu-submenu-inline.ant-menu-submenu-title {
    height: 80px;
  }
`;

const { Sider } = Layout;
function Siderbar() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const handleMenuClick = (item) => {
    setSelectedMenuItem(item.id);
  };
  const cx = classNames.bind(style);

  const [collapsed, setCollapsed] = useState(false);

  const MenuItem = SiderbarData.map((item) =>
    item.children ? (
      <Menu.SubMenu
        key={item.id}
        title={
          <span>
            {item.icon}
            <span>{item.label}</span>
          </span>
        }
      >
        {item.children.map((subItem) => (
          <Menu.Item key={subItem.id} onClick={() => handleMenuClick(subItem)}>
            <NavLink to={subItem.path}>
              {subItem.icon}
              <span className={cx("sub-menu-title")}> {subItem.label} </span>
            </NavLink>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={item.id} onClick={() => handleMenuClick(item)}>
        <NavLink to={item.path}>
          {item.icon}
          <span className={cx("menu-title")}>{item.label}</span>
        </NavLink>
      </Menu.Item>
    )
  );
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={360}
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
        theme="light"
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        className={cx("menu")}
      >
        {MenuItem}
      </CustomMenu>
    </Sider>
  );
}
export default Siderbar;

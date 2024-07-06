import style from "./HeaderInfor.module.css";
import classNames from "classnames/bind";
import { Button, Layout } from "antd";

import { BellFilled } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import user from "../../../api/user";
import axios from "axios";
import getTokenFromLocalStorage from "../../../service/getTokenFromLocalStorage";
import { useEffect, useState } from "react";

const { Header } = Layout;

const item = [
  {
    label: "Thông tin cá nhân",
    key: "1",
  },
  {
    label: "Đăng xuất",
    key: "2",
  },
];

function HeaderInfor() {
  const navigate = useNavigate();
  const cx = classNames.bind(style);
  const [userName, setUserName] = useState("");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const auth = getTokenFromLocalStorage();

  useEffect(() => {
    getCurrentUserName();
  }, []);

  const getCurrentUserName = async () => {
    try {
      const response = await axios.get(user.getCurrentUsername, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setUserName(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Header
      style={{
        padding: 0,
        background: "#87cefa1c",
      }}
      className={cx("header")}
    >
      <div className={cx("header-text")}>
        HỆ THỐNG QUẢN LÝ DƯỢC BỆNH VIỆN{" "}
        <Button className={cx("bell")} icon={<BellFilled />} />
        <Button className={cx("user")} icon={<UserOutlined />}>
          {userName}
        </Button>
        <Button
          className={cx("logout")}
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          {" "}
          Đăng xuất{" "}
        </Button>
      </div>
    </Header>
  );
}
export default HeaderInfor;

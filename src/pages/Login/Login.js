import React, { useState } from "react";

import style from "./Login.module.css";
import classNames from "classnames/bind";
import authService from "../../service/auth-service";
import { useNavigate } from "react-router-dom";
import logo from "./v987-18a.jpg";

const cx = classNames.bind(style);

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberPassword, setRememberPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Username:", userName);
    console.log("Password:", password);
    try {
      await authService.login(userName, password).then(
        () => {
          navigate("/");
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
  };
  return (
    <body className={cx("body")}>
      <div className={cx("container")}>
        <div className={cx("content-wrapper")}>
          <form className={cx("form")}>
            <img src={logo} className={cx("logo-img")} />
            <div className={cx("form-title")}>
              <h1>LOGIN</h1>
            </div>
            <div>
              <div className={cx("input")}>
                <input
                  type="text"
                  value={userName}
                  className={cx("input-field")}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={cx("input")}>
                <input
                  type="password"
                  value={password}
                  className={cx("input-field")}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={cx("input1")}>
                <input
                  type="checkbox"
                  id="remember-password"
                  className={cx("checkbox")}
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                />
                <label
                  htmlFor="remember-password"
                  className={cx("remember-label")}
                >
                  Remeber Password
                </label>
                <a href="/#" className={cx("form-add-forgot")}>
                  Forgot Password?
                </a>
              </div>

              <div className="form-btn">
                <button
                  type="submit"
                  className={cx("form-btn-1")}
                  onClick={handleSubmit}
                >
                  {" "}
                  SIGN IN
                </button>
              </div>

              <p className={cx("form-add-register")}>
                {" "}
                Don't have an account ?<a href="/signup"> Register here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </body>
  );
};

export default Login;

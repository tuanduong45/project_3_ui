import React, { useState } from "react";
import style from "./SignUp.module.css";
import classNames from "classnames/bind";

function SignUpForm() {
  // State để lưu trữ dữ liệu của form
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const cx = classNames.bind(style);

  // Hàm xử lý khi người dùng thay đổi giá trị của input
  /* const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log("Input name: ", name, "value:", value);
    setFormData({
      ...formData,
      [name]: value,
    });
  }; */

  // Hàm xử lý khi form được gửi đi
  /* const handleSubmit = (event) => {
    event.preventDefault();
    // Đoạn này bạn có thể thực hiện xác nhận dữ liệu, gửi request tới server, v.v.
    // Sau khi xử lý xong, bạn có thể reset form bằng cách gán lại giá trị ban đầu cho `formData`
    setFormData({
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phonenumber: "",
    });
  }; */

  return (
    <body className={cx("body")}>
      <form className={cx("form")}>
        <div className={cx("input")}>
          <label className={cx("input-label")}>Firstname</label>
          <input
            type="text"
            className={cx("input-field")}
            value={firstname}
            onChange={(e) => setFirstName(e.target.firstname)}
            required
          />
        </div>
        <div className={cx("input")}>
          <label className={cx("input-label")}>Lastname</label>
          <input
            type="text"
            className={cx("input-field")}
            value={lastname}
            onChange={(e) => setLastName(e.target.lastname)}
            required
          />
        </div>
        <div className={cx("input")}>
          <label className={cx("input-label")}>Username</label>
          <input
            type="text"
            className={cx("input-field")}
            value={username}
            onChange={(e) => setUsername(e.target.username)}
            required
          />
        </div>
        <div className={cx("input")}>
          <label className={cx("input-label")}>Password</label>
          <input
            type="password"
            className={cx("input-field")}
            value={password}
            onChange={(e) => setPassword(e.target.password)}
            required
          />
        </div>
        <div className={cx("input")}>
          <label className={cx("input-label")}>Email</label>
          <input
            type="email"
            className={cx("input-field")}
            value={email}
            onChange={(e) => setEmail(e.target.email)}
            required
          />
        </div>
        <div className={cx("input")}>
          <label className={cx("input-label")}>Phonenumber</label>
          <input
            type="text"
            className={cx("input-field")}
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.phonenumber)}
            required
          />
        </div>
        <div className={cx("form-btn")}>
          <button className={cx("form-btn1")} type="submit">
            SIGN UP
          </button>
        </div>
      </form>
    </body>
  );
}

export default SignUpForm;

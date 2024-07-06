import { Link, NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Menu.module.css";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);
function MenuItem({ title, to, icon }) {
  return (
    <NavLink className={cx("menu-item")} to={to} activeClassName={cx("active")}>
      {icon}
      <span className={cx("title")}>{title}</span>
    </NavLink>
  );
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};
export default MenuItem;

import { HomeFilled } from "@ant-design/icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules } from "@fortawesome/free-solid-svg-icons/faCapsules";
import { faTruckField } from "@fortawesome/free-solid-svg-icons";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons/faWarehouse";
import { faChartPie } from "@fortawesome/free-solid-svg-icons/faChartPie";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faBuildingUser } from "@fortawesome/free-solid-svg-icons/faBuildingUser";
import { faFileImport } from "@fortawesome/free-solid-svg-icons/faFileImport";
import { faStore } from "@fortawesome/free-solid-svg-icons/faStore";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons/faSquarePlus";
import routes from "../../../config/router";
import classNames from "classnames/bind";
import style from "./Siderbar.module.css";
const cx = classNames.bind(style);
export const SiderbarData = [
  {
    id: 1,
    icon: <FontAwesomeIcon icon={faHouse} className={cx("menu-icon")} />,
    label: "TRANG CHỦ",
    path: routes.home,
  },
  {
    id: 2,
    icon: <FontAwesomeIcon icon={faBuildingUser} className={cx("menu-icon")} />,
    label: "QUẢN LÝ KHOA-BỘ PHẬN",
    path: routes.departmet,
  },
  {
    id: 3,
    icon: <FontAwesomeIcon icon={faUser} className={cx("menu-icon")} />,
    label: "QUẢN LÝ NGƯỜI DÙNG",
    path: routes.user,
  },
  {
    id: 4,
    icon: <FontAwesomeIcon icon={faCapsules} className={cx("menu-icon")} />,
    label: "QUẢN LÝ DANH MỤC THUỐC",
    path: routes.medicine,
  },
  {
    id: 5,
    icon: <FontAwesomeIcon icon={faTruckField} className={cx("menu-icon")} />,
    label: "QUẢN LÝ NHÀ CUNG CẤP",
    path: routes.supplier,
  },
  {
    id: 6,
    icon: <FontAwesomeIcon icon={faWarehouse} className={cx("menu-icon")} />,
    label: "QUẢN LÝ KHO HÀNG",
    children: [
      {
        id: 7,
        icon: (
          <FontAwesomeIcon
            icon={faFileImport}
            className={cx("sub-menu-icon")}
          />
        ),
        label: "QUẢN LÝ NHẬP KHO",
        path: routes.importReceipt,
      },
      {
        id: 8,
        icon: (
          <FontAwesomeIcon icon={faStore} className={cx("sub-menu-icon")} />
        ),
        label: "QUẢN LÝ TỒN KHO",
        path: routes.inventory,
      },
      {
        id: 9,
        icon: (
          <FontAwesomeIcon
            icon={faSquarePlus}
            className={cx("sub-menu-icon")}
          />
        ),
        label: "QUẢN LÝ YÊU CẦU THUỐC",
        path: routes.requestReceipt,
      },
    ],
  },
  {
    id: 10,
    icon: <FontAwesomeIcon icon={faChartPie} className={cx("menu-icon")} />,
    label: "BÁO CÁO-THỐNG KÊ",
    path: routes.report,
  },
];

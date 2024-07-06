import routes from "../config/router";
import Department from "../component/department/Department";
import Login from "../pages/Login/Login";
import User from "../component/user/User";
import Admin from "../component/Admin/Admin";
import LoginLayout from "../layout/defaultLayout/LoginLayout/LoginLayout";
import Drug from "../component/drug/Drug";
import Supplier from "../component/supplier/Supplier";
import ImportReceipt from "../component/importReceipt/ImportReceipt";
import DepartmentCreate from "../component/department/DepartmentCreate";
import Inventory from "../component/inventory/Inventory";
import RequestReceipt from "../component/requestReceipt/RequestReceipt";
import Chart from "../component/chart/Chart";
import { Layout } from "antd";
import ReportLayout from "../layout/ReportLayout/ReportLayout";

const publicRoutes = [
  { path: routes.home, component: Admin },
  { path: routes.login, component: Login, layout: LoginLayout },
  { path: routes.departmet, component: Department },
  { path: routes.departmentCreate, component: DepartmentCreate },
  { path: routes.user, component: User },
  { path: routes.drug, component: Drug },
  { path: routes.supplier, component: Supplier },
  { path: routes.importReceipt, component: ImportReceipt },
  { path: routes.inventory, component: Inventory },
  { path: routes.requestReceipt, component: RequestReceipt },
  { path: routes.report, component: Chart },
];

export default publicRoutes;

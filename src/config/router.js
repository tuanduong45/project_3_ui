import importReceipt from "../api/importReceipt";
import inventory from "../api/inventory";

const routes = {
  login: "/login",
  signup: "/signup",
  home: "/",

  departmet: "/department",
  departmentCreate: "/department/create",

  user: "/user",
  drug: "/medicine",
  supplier: "/supplier",
  medicine: "/medicine",
  importReceipt: "/api/import-receipt",

  inventory: "/api/inventory",

  requestReceipt: "/api/drug-request",

  report: "/report",
};
export default routes;

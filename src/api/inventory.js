import server from "./hostname";
const inventory = {
  getList: `"http://${server.host_name_deploy}api/inventory/get-list-inventory"`,
  getListDetail: `"http://${server.host_name_deploy}api/inventory/get-list-inventory-detail"`,
  addDrugWarn: ` "http://${server.host_name_deploy}/api/inventory/add-warning-drug"`,
};
export default inventory;

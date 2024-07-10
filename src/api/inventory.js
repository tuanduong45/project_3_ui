import server from "./hostname";
const inventory = {
  getList: `"http://${server.hostnamedeploy}api/inventory/get-list-inventory"`,
  getListDetail: `"http://${server.hostnamedeploy}api/inventory/get-list-inventory-detail"`,
  addDrugWarn: ` "http://${server.hostnamedeploy}/api/inventory/add-warning-drug"`,
};
export default inventory;

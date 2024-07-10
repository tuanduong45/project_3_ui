import server from "./hostname";
const supplier = {
  getList: `"http://${server.hostnamedeploy}api/supplier/get-list"`,
  create: `"http://${server.hostnamedeploy}api/supplier/create"`,
  update: `"http://${server.hostnamedeploy}/api/supplier/update"`,
  delete: `"http://${server.hostnamedeploy}/api/supplier/delete"`,
  getListIdTaxCodeName: `"http://${server.hostnamedeploy}/api/supplier/get-list-id-taxCode-name"`,
};
export default supplier;

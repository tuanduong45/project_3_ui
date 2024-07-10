import server from "./hostname";
const supplier = {
  getList: `"http://${server.host_name_deploy}api/supplier/get-list"`,
  create: `"http://${server.host_name_deploy}api/supplier/create"`,
  update: `"http://${server.host_name_deploy}/api/supplier/update"`,
  delete: `"http://${server.host_name_deploy}/api/supplier/delete"`,
  getListIdTaxCodeName: `"http://${server.host_name_deploy}/api/supplier/get-list-id-taxCode-name"`,
};
export default supplier;

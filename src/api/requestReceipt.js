import server from "./hostname";
const requestReceipt = {
  create: `"http://${server.host_name_deploy}/api/request-receipt/create"`,
  getList: `"http://${server.host_name_deploy}/api/request-receipt/get-list"`,
  getListDrug: `"http://${server.host_name_deploy}/api/request-receipt/get-list-drug"`,
  getListDrugFromInventory: `"http://${server.host_name_deploy}/api/request-receipt/get-list-drug-from-inventory"`,
  confirmRequest: `"http://${server.host_name_deploy}/api/request-receipt/confirm-receipt"`,
  rejectRequest: `"http://${server.host_name_deploy}/api/request-receipt/reject-receipt"`,
};
export default requestReceipt;

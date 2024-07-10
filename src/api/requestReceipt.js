import server from "./hostname";
const requestReceipt = {
  create: `"http://${server.hostnamedeploy}/api/request-receipt/create"`,
  getList: `"http://${server.hostnamedeploy}/api/request-receipt/get-list"`,
  getListDrug: `"http://${server.hostnamedeploy}/api/request-receipt/get-list-drug"`,
  getListDrugFromInventory: `"http://${server.hostnamedeploy}/api/request-receipt/get-list-drug-from-inventory"`,
  confirmRequest: `"http://${server.hostnamedeploy}/api/request-receipt/confirm-receipt"`,
  rejectRequest: `"http://${server.hostnamedeploy}/api/request-receipt/reject-receipt"`,
};
export default requestReceipt;

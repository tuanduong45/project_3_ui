const requestReceipt = {
  create: "http://localhost:8081/api/request-receipt/create",
  getList: "http://localhost:8081/api/request-receipt/get-list",
  getListDrug: "http://localhost:8081/api/request-receipt/get-list-drug",
  getListDrugFromInventory:
    "http://localhost:8081/api/request-receipt/get-list-drug-from-inventory",
  confirmRequest: "http://localhost:8081/api/request-receipt/confirm-receipt",
  rejectRequest: "http://localhost:8081/api/request-receipt/reject-receipt",
};
export default requestReceipt;

import server from "./hostname";
const importReceipt = {
  list: `"http://${server.host_name_deploy}/api/import-receipt/get-lst"`,
  getDetail: `"http://${server.host_name_deploy}/api/import-receipt/get-lst-detail"`,
  create: `"http://${server.host_name_deploy}/api/import-receipt/create"`,
};
export default importReceipt;

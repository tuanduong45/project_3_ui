import server from "./hostname";
const drug = {
  getList: `"http://${server.host_name_deploy}/api/drug/get-list"`,
  create: `"http://${server.host_name_deploy}/api/drug/create"`,
  update: `"http://${server.host_name_deploy}/api/drug/update"`,
  switchStatus: `"http://${server.host_name_deploy}/api/drug/switch-status"`,
  getCommonIdCodeName: `"http://${server.host_name_deploy}/api/drug/get-list-id-code-name"`,
};
export default drug;

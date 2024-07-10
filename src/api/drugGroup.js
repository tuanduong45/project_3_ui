import server from "./hostname";
const drugGroup = {
  create: `"http://${server.host_name_deploy}/api/drug-group/create"`,
  getId: `"http://${server.host_name_deploy}/api/drug-group/get-id"`,
  getDrugGroupDescribe: `"http://${server.host_name_deploy}/api/drug-group/get-drug-group-describe"`,
  update: `"http://${server.host_name_deploy}/api/drug-group/update"`,
  delete: `"http://${server.host_name_deploy}/api/drug-group/delete"`,
};
export default drugGroup;

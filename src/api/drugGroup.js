import server from "./hostname";
const drugGroup = {
  create: `"http://${server.hostnamedeploy}/api/drug-group/create"`,
  getId: `"http://${server.hostnamedeploy}/api/drug-group/get-id"`,
  getDrugGroupDescribe: `"http://${server.hostnamedeploy}/api/drug-group/get-drug-group-describe"`,
  update: `"http://${server.hostnamedeploy}/api/drug-group/update"`,
  delete: `"http://${server.hostnamedeploy}/api/drug-group/delete"`,
};
export default drugGroup;

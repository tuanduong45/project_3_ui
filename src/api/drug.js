const drug = {
  getList: `"http://${server.hostnamedeploy}/api/drug/get-list"`,
  create: `"http://${server.hostnamedeploy}/api/drug/create"`,
  update: `"http://${server.hostnamedeploy}/api/drug/update"`,
  switchStatus: `"http://${server.hostnamedeploy}/api/drug/switch-status"`,
  getCommonIdCodeName: `"http://${server.hostnamedeploy}/api/drug/get-list-id-code-name"`,
};
export default drug;

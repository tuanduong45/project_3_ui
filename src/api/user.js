import server from "./hostname";
const user = {
  getList: `"http://${server.hostnamedeploy}api/user/get-list"`,
  add: `"http://${server.hostnamedeploy}api/user/create"`,
  update: `"http://${server.hostnamedeploy}/api/user/update"`,
  switchStatus: ` "http://${server.hostnamedeploy}/api/user/switch-status"`,
  getCurrentUsername: `"http://${server.hostnamedeploy}/api/user/get-current-user-name"`,
};
export default user;

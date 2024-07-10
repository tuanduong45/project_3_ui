import server from "./hostname";
const user = {
  getList: `"http://${server.host_name_deploy}api/user/get-list"`,
  add: `"http://${server.host_name_deploy}api/user/create"`,
  update: `"http://${server.host_name_deploy}/api/user/update"`,
  switchStatus: ` "http://${server.host_name_deploy}/api/user/switch-status"`,
  getCurrentUsername: `"http://${server.host_name_deploy}/api/user/get-current-user-name"`,
};
export default user;

import server from "./hostname";
const department = {
  getList: `http://${server.host_name_deploy}/department/getList`,
  create: `http://${server.host_name_deploy}/department/create`,
  delete: `http://${server.host_name_deploy}/department/delete`,
  update: `http://${server.host_name_deploy}/department/update`,
};
export default department;

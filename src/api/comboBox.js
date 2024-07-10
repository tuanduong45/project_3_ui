import server from "./hostname";

const comboBox = {
  department: `http://${server.host_name_deploy}/combo-box/get-lst-department-name-code`,
  role: `http://${server.host_name_deploy}/combo-box/get-lst-role-name-code`,
};
export default comboBox;

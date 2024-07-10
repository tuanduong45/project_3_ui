import server from "./hostname";
const Report = {
  importByDate: `"http://${server.host_name_deploy}/api/statistics/report-import-by-date"`,
  requestReceiptByDate: `"http://${server.host_name_deploy}/api/statistics/report-request-by-date"`,
  supplierByDate: `"http://${server.host_name_deploy}/api/statistics/report-supplier-by-date"`,
  inventory: `"http://${server.host_name_deploy}/api/statistics/report-inventory"`,
  summarizeReport: ` "http://${server.host_name_deploy}/api/statistics/summarize-report"`,
};
export default Report;

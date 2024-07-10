const Report = {
  importByDate: `"http://${server.hostnamedeploy}/api/statistics/report-import-by-date"`,
  requestReceiptByDate: `"http://${server.hostnamedeploy}/api/statistics/report-request-by-date"`,
  supplierByDate: `"http://${server.hostnamedeploy}/api/statistics/report-supplier-by-date"`,
  inventory: `"http://${server.hostnamedeploy}/api/statistics/report-inventory"`,
  summarizeReport: ` "http://${server.hostnamedeploy}/api/statistics/summarize-report"`,
};
export default Report;

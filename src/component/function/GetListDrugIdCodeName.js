import drug from "../../api/drug";
import axios from "axios";
import getTokenFromLocalStorage from "../../service/getTokenFromLocalStorage";
const getListDrug = async () => {
  const auth = getTokenFromLocalStorage();
  try {
    const response = await axios.get(drug.getCommonIdCodeName, {
      headers: { Authorization: `Bearer ${auth}` },
    });
    return response.data;
  } catch (error) {
    console.log("Có lỗi khi lấy danh sách thuốc id code name");
  }
};
export default getListDrug;

import unit from "../../api/unit";
import axios from "axios";

const getListUnitIdNameCvrRule = async () => {
  try {
    const response = await axios.get(unit.getList);
    return response.data;
  } catch (error) {
    console.error("Error fetching unit:", error);
  }
};
export default getListUnitIdNameCvrRule;

const getTokenFromLocalStorage = () => {
  // Lấy dữ liệu từ Local Storage với key là 'token'
  const tokenData = localStorage.getItem("token");

  // Kiểm tra nếu dữ liệu tồn tại
  if (tokenData) {
    // Parse dữ liệu từ JSON về object
    const tokenObject = JSON.parse(tokenData);
    // Trả về trường token từ object
    return tokenObject.token;
  } else {
    // Nếu không tìm thấy dữ liệu, trả về null hoặc giá trị mặc định tùy thuộc vào trường hợp của bạn
    return null;
  }
};
const getRefreshTokenFromLocalStorage = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const tokenObject = JSON.parse(refreshToken);
    return tokenObject.refreshToken;
  } else {
    return null;
  }
};
export default getTokenFromLocalStorage;

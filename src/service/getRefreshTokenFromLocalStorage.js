const getRefreshTokenFromLocalStorage = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const tokenObject = JSON.parse(refreshToken);
    return tokenObject.refreshToken;
  } else {
    return null;
  }
};
export default getRefreshTokenFromLocalStorage;

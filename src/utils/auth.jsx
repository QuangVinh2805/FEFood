export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Kiểm tra xem có token hay không
  };
  
  export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
    return user ? user.role : null; // Trả về vai trò người dùng hoặc null nếu không có
  };
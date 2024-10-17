// Password validation functions
const isMinLengthPassword = (password) => {
    return password.length >= 8;
};

const isHasLowerCasePassword = (password) => {
    return /[a-z]/.test(password);
};

const isHasUpperCasePassword = (password) => {
    return /[A-Z]/.test(password);
};

const isHasSymbolPassword = (password) => {
    return /[.@$!%*?&]/.test(password);
};

module.exports = {
    validUsername: (username) => {
        const minLength = 4;
        const maxLength = 20;
        const usernamePattern = /^[a-zA-Z0-9._-]+$/; // Only letters, numbers and some special characters are allowed
    
        if (username.length < minLength || username.length > maxLength) {
            return 'Tên đăng nhập phải từ 4 đến 20 ký tự.';
        }
        
        if (!usernamePattern.test(username)) {
            return 'Tên đăng nhập chỉ cho phép ký tự chữ cái, số và các ký tự ., _ và -.';
        }
    },
  
    validatePassword: (password) => {
        if (!isMinLengthPassword(password)) {
            return 'Mật khẩu phải tối thiểu 8 ký tự.';
        }
        if (!isHasLowerCasePassword(password)) {
            return 'Mật khẩu phải ít nhất 1 chữ viết thường.';
        }
        if (!isHasUpperCasePassword(password)) {
            return 'Mật khẩu phải ít nhất 1 chữ viết hoa.';
        }
        if (!isHasSymbolPassword(password)) {
            return 'Mật khẩu phải ít nhất 1 ký tự đặc biệt.';
        }
    },
  
    validateRegisterData: (data) => {
        const fields = [
            { field: 'name', message: 'Họ và tên không được bỏ trống' },
            { field: 'user_name', message: 'Tên đăng nhập không được bỏ trống' },
            { field: 'password', message: 'Mật khẩu không được bỏ trống'}
        ];
    
        for (const { field, message } of fields) {
            if (!data[field]) {
                return message;
            }
        }
    }
}
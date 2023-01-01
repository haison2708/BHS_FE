import {IError} from './../types/interface';

const regexEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = (email: string) => {
  const error: IError = {
    isError: false,
    msgError: '',
  };

  if (email === '') {
    error.isError = true;
    error.msgError = 'emailIsNotChosen'; //Chưa nhập email
    return error;
  }

  if (email.length > 256) {
    error.isError = true;
    error.msgError = 'emailLengthMustNotOver256Characters'; //Email không quá 256 kí tự
  }

  if (!regexEmail.test(email)) {
    error.isError = true;
    error.msgError = 'invalidEmail'; //Email không hợp lệ!
  }

  return error;
};

const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][\w~@#$%^&*+=`|{}:;!.?\()\[\]-]{5,15}$/;

type StateInputPassword = 'old' | 'new';

export const validatePassword = (password: string = '', state: StateInputPassword = 'old') => {
  const isOld = state;

  const error: IError = {
    isError: false,
    msgError: '',
  };

  if (password === '') {
    error.isError = true;
    error.msgError = 'emptyPassword'; //Chưa nhập mật khẩu
    return error;
  }

  if (!regexPassword.test(password)) {
    error.isError = true;
    //Mật khẩu ít nhất 5 kí tự bao gồm kí tự thường và số!
    error.msgError = !isOld
      ? 'oldPasswordVerificationRule'
      : isOld === 'old'
      ? 'oldPasswordVerificationRule'
      : 'newPasswordVerificationRule';
    return error;
  }

  return error;
};

export const validateConfirmPassword = (
  confirmPassword: string = '',
  password: string = '',
  state: StateInputPassword = 'old'
) => {
  const isOld = state;

  const error: IError = {
    isError: false,
    msgError: '',
  };

  if (confirmPassword === '') {
    error.isError = true;
    error.msgError = 'needToFillThisField'; //Không để trống ô này
    return error;
  }

  if (confirmPassword !== password) {
    error.isError = true;
    //Mật khẩu nhập lại không hợp lệ!
    error.msgError = !isOld
      ? 'invalidConfirmOldPassword'
      : isOld === 'old'
      ? 'invalidConfirmOldPassword'
      : 'invalidConfirmNewPassword';
    return error;
  }

  return error;
};

const regexPhone = /^(((0[3|5|7|8|9])+([0-9]{8,15}))|([0-9]{8,15}))\b$/;

export const validatePhone = (phone: string = '') => {
  const error: IError = {
    isError: false,
    msgError: '',
  };

  if (phone === '') {
    error.isError = true;
    error.msgError = 'emptyPhoneNumber'; //Chưa nhập số điện thoại!
    return error;
  }

  if (!regexPhone.test(phone)) {
    error.isError = true;
    error.msgError = 'invalidPhone'; //Số điện thoại không hợp lệ!
    return error;
  }

  return error;
};

const regexFullName = /^([\w]|[\W]|[\s]){1,30}$/;

export const validateFullName = (fullName: string = '') => {
  const error: IError = {
    isError: false,
    msgError: '',
  };

  if (fullName === '') {
    error.isError = true;
    error.msgError = 'emptyName'; // Chưa nhập tên!
    return error;
  }

  if (!regexFullName.test(fullName)) {
    error.isError = true;
    error.msgError = 'invalidName'; //Tên tối đa 30 kí tự!
    return error;
  }

  return error;
};

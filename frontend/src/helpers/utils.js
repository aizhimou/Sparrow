import { notifications } from '@mantine/notifications';
import { toastConstants } from '../constants/toast.constants.js';
import '@mantine/notifications/styles.css';

export function showError(error) {
  if (error.message) {
    if (error.name === 'AxiosError') {
      switch (error.response.status) {
        case 401: {
          const searchParams = new URLSearchParams(window.location.search);
          const hasExpired = searchParams.get('expired') === 'true';
          if (!hasExpired) {
            window.location.href = '/login?expired=true';
            localStorage.removeItem('user');
          }
          break;
        }
        case 429:
          notifications.show({
            color: toastConstants.ERROR_COLOR,
            title: 'Error',
            message: 'Too many requests, please try again later.',
            position: 'top-right',
            autoClose: toastConstants.ERROR_TIMEOUT,
          });
          break;
        case 500:
          notifications.show({
            color: toastConstants.ERROR_COLOR,
            title: 'Error',
            message: 'Internal server error, please contact administrator.',
            position: 'top-right',
            autoClose: toastConstants.ERROR_TIMEOUT,
          });
          break;
        default:
          notifications.show({
            color: toastConstants.ERROR_COLOR,
            title: 'Error',
            message: error.message,
            position: 'top-right',
            autoClose: toastConstants.ERROR_TIMEOUT,
          });
      }
      return;
    }
    notifications.show({
      color: toastConstants.ERROR_COLOR,
      title: 'Error',
      message: error.message,
      position: 'top-right',
      autoClose: toastConstants.ERROR_TIMEOUT,
    });
  } else {
    notifications.show({
      color: toastConstants.ERROR_COLOR,
      title: 'Error',
      message: error,
      position: 'top-right',
      autoClose: toastConstants.ERROR_TIMEOUT,
    });
  }
}

export function showWarning(message) {
  notifications.show({
    color: toastConstants.WARNING_COLOR,
    title: 'Warning',
    message: message,
    position: 'top-right',
    autoClose: toastConstants.WARNING_TIMEOUT,
  });
}

export function showSuccess(message) {
  notifications.show({
    color: toastConstants.SUCCESS_COLOR,
    title: 'Success',
    message: message,
    position: 'top-right',
    autoClose: toastConstants.SUCCESS_TIMEOUT,
  });
}

export function showInfo(message) {
  notifications.show({
    color: toastConstants.INFO_COLOR,
    title: 'Info',
    message: message,
    position: 'top-right',
    autoClose: toastConstants.INFO_TIMEOUT,
  });
}

export function showNotice(message) {
  notifications.show({
    color: toastConstants.NOTICE_COLOR,
    title: 'Notice',
    message: message,
    position: 'top-right',
    autoClose: toastConstants.NOTICE_TIMEOUT,
  });
}

export function openPage(url) {
  window.open(url);
}

export function removeTrailingSlash(url) {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  } else {
    return url;
  }
}

// navigationService.js
import { useRouter } from 'expo-router';

let redirectCallback = null;

export const setRedirectCallback = (callback) => {
  redirectCallback = callback;
};

export const redirectToHome = () => {
  if (redirectCallback) {
    redirectCallback('/');
  }
};

'use-strict';

import setCookie from './utils/setCookie.js';
import getAndSetConfig from './utils/getAndSetConfig.js';
import getFormData from './utils/getFormData.js';

// Getting and setting config as cookie on URL change
getAndSetConfig();

// Get user info and set it as cookie
const saveMyDesignForm = document.querySelector('#popupForm');
saveMyDesignForm.addEventListener('submit', (e) => {
  e.preventDefault();
  setCookie('userProfile', getFormData(saveMyDesignForm));
});

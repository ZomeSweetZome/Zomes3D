import setCookie from './setCookie.js';

const getAndSetConfig = function () {
  let lastConfig = null;

  function getConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('config');
  }

  function handleConfigChange() {
    const currentConfig = getConfigFromURL();
    if (currentConfig !== lastConfig) {
      setCookie('config', { config: currentConfig });
      lastConfig = currentConfig;
    }
  }

  window.history.pushState = new Proxy(window.history.pushState, {
    apply: (target, thisArg, argArray) => {
      const result = target.apply(thisArg, argArray);
      handleConfigChange();
      return result;
    },
  });
};

export default getAndSetConfig;

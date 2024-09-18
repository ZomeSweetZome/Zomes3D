const getFormData = function (form) {
  const formData = new FormData(form);
  const formObject = {};

  for (const [key, value] of formData.entries()) {
    formObject[key] = value;
  }

  return formObject;
};

export default getFormData;

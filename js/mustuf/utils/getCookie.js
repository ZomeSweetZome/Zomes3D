function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
      const cookieValue = c.substring(nameEQ.length, c.length);
      try {
        // Attempt to parse the cookie value as JSON
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (e) {
        // If parsing fails, return the raw string
        return cookieValue;
      }
    }
  }
  return null;
}

export default getCookie;

function setCookie(name, obj) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);

  // Convert the object to a JSON string, properly encoded to prevent XSS
  const cookieValue = encodeURIComponent(JSON.stringify(obj));

  // Determine if we're on the live site or local development
  const isLive = window.location.hostname.includes('zomes.com');
  const domainAttribute = isLive ? 'domain=.zomes.com;' : '';

  document.cookie = `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=/; ${domainAttribute} SameSite=Lax`;
}

export default setCookie;

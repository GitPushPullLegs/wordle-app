function getArgs(url: string, options?: object) {
  // @ts-ignore
  if (options && options.args) {
    // @ts-ignore
    let urlArgs = Object.keys(options.args).map((a) => encodeURIComponent(a) + "=" + encodeURIComponent(options.args[a])).join("&")
    url += urlArgs ? "?" + urlArgs : ""
  }
  let args = {
    method: "GET",
  }
  // @ts-ignore
  args.headers = options?.headers ? { ...options.headers } : {};

  // If a CSRF token exists, add it to the request headers.
  if (getCookie("csrf_access_token")) {
    // @ts-ignore
    args.headers["X-CSRF-TOKEN"] = getCookie("csrf_access_token");
  }
  // @ts-ignore
  if (options && options.data) {
    args.method = "POST";
    // @ts-ignore
    args.body = JSON.stringify(options.data);
    // @ts-ignore
    args.headers["Content-Type"] = "application/json";
  }
  return { args, updatedUrl: url }
}

function getCookie(name: string) {
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith(name + "="));
  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split("=")[1]);
}

export default function useFetch() {
  return (url: string, options?: object) => {
    let { args, updatedUrl } = getArgs(url, options)
    return fetch(updatedUrl, args)
      .then(r => {
        if (r.status !== 200) {
          throw r
        }
        return r
      })
      .then(v => v.json())
  }
}

const EXTERNAL_PREFIXES = ["mailto:", "tel:", "javascript:"];

export function isExternalLink(href) {
  if (!href) return false;
  if (EXTERNAL_PREFIXES.some((prefix) => href.startsWith(prefix))) return true;
  if (href.startsWith("/")) return false;

  try {
    const url = new URL(href);
    return !url.hostname.includes("noeen.sa");
  } catch {
    return false;
  }
}

export function toAppPath(href) {
  if (!href || href === "#") return "/";
  if (isExternalLink(href)) return href;

  if (href.startsWith("/") && !href.startsWith("/ar/") && !href.startsWith("/en/")) {
    return href;
  }

  try {
    const url = new URL(href, "https://noeen.sa");
    let path = url.pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
    if (!path.startsWith("/")) path = `/${path}`;
    return `${path}${url.search}` || "/";
  } catch {
    return href.startsWith("/") ? href : `/${href}`;
  }
}

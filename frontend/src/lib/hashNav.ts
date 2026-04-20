/** Used when `router.push("/")` drops the hash — home page reads this and scrolls. */
export const PENDING_HASH_KEY = "iceCreamPendingHash";

export function setPendingHash(id: string) {
  try {
    sessionStorage.setItem(PENDING_HASH_KEY, id);
  } catch {
    /* private mode */
  }
}

export function takePendingHash(): string | null {
  try {
    const v = sessionStorage.getItem(PENDING_HASH_KEY);
    if (v) sessionStorage.removeItem(PENDING_HASH_KEY);
    return v;
  } catch {
    return null;
  }
}

export function scrollToElementById(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  return false;
}

type AppRouterLike = { push: (href: string) => void | Promise<boolean> };

/**
 * Returns true if the click was handled (hash link). Caller should still run e.g. `close()` for menus.
 */
export function navigateOrScrollToHash(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  router: AppRouterLike,
): boolean {
  const hashIdx = href.indexOf("#");
  if (hashIdx === -1) return false;

  const pathPart = href.slice(0, hashIdx);
  const path = pathPart === "" ? "/" : pathPart;
  const id = href.slice(hashIdx + 1);
  if (!id) return false;

  e.preventDefault();

  if (path === pathname) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToElementById(id);
      });
    });
    window.history.replaceState(null, "", `${path}#${id}`);
    return true;
  }

  setPendingHash(id);
  void router.push(path);
  return true;
}

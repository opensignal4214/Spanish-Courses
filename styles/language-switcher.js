(() => {
  const STORAGE_KEY = "spanishLessonsPreferredLocale";
  const LOCALE_TO_ROUTE_KEY = {
    en: "index.html",
    tw: "tw/index.html",
  };

  const languageSelect = document.querySelector("[data-language-select]");
  if (!languageSelect) {
    return;
  }

  const supportedLocales = new Set(Object.keys(LOCALE_TO_ROUTE_KEY));

  function normalizePathname(pathname) {
    let normalized = (pathname || "/").replace(/\/+/g, "/");
    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }
    return normalized;
  }

  function getRouteContext(pathname) {
    const normalized = normalizePathname(pathname);
    const withIndex = normalized.endsWith("/") ? `${normalized}index.html` : normalized;
    const segments = withIndex.replace(/^\//, "").split("/").filter(Boolean);

    if (segments.length >= 2 && segments[segments.length - 2] === "tw" && segments[segments.length - 1] === "index.html") {
      const baseSegments = segments.slice(0, -2);
      const basePath = `/${baseSegments.length ? `${baseSegments.join("/")}/` : ""}`;
      return { routeKey: "tw/index.html", basePath };
    }

    if (segments.length >= 1 && segments[segments.length - 1] === "index.html") {
      const baseSegments = segments.slice(0, -1);
      const basePath = `/${baseSegments.length ? `${baseSegments.join("/")}/` : ""}`;
      return { routeKey: "index.html", basePath };
    }

    return { routeKey: null, basePath: "/" };
  }

  function getLocaleFromRouteKey(routeKey) {
    return routeKey === LOCALE_TO_ROUTE_KEY.tw ? "tw" : "en";
  }

  function buildAbsoluteUrl(basePath, routeKey) {
    const ensuredBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
    const targetPath = `${ensuredBasePath}${routeKey}`.replace(/\/+/g, "/");
    return `${window.location.origin}${targetPath}`;
  }

  function readSavedLocale() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved && supportedLocales.has(saved) ? saved : null;
    } catch (_error) {
      return null;
    }
  }

  function saveLocale(locale) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch (_error) {
      // Ignore storage failures and continue with navigation.
    }
  }

  const routeContext = getRouteContext(window.location.pathname);
  const currentLocale = getLocaleFromRouteKey(routeContext.routeKey);
  const savedLocale = readSavedLocale();

  languageSelect.value = currentLocale;

  if (routeContext.routeKey === LOCALE_TO_ROUTE_KEY.en && savedLocale && savedLocale !== "en") {
    const savedRouteKey = LOCALE_TO_ROUTE_KEY[savedLocale] || LOCALE_TO_ROUTE_KEY.en;
    window.location.replace(buildAbsoluteUrl(routeContext.basePath, savedRouteKey));
    return;
  }

  languageSelect.addEventListener("change", (event) => {
    const selectedLocale = event.target.value;
    const targetRouteKey = LOCALE_TO_ROUTE_KEY[selectedLocale] || LOCALE_TO_ROUTE_KEY.en;

    saveLocale(selectedLocale);
    window.location.assign(buildAbsoluteUrl(routeContext.basePath, targetRouteKey));
  });
})();

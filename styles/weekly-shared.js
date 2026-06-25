(() => {
  const getTableLabel = (table, index) => {
    let previous = table.previousElementSibling;

    while (previous) {
      if (/^H[1-6]$/.test(previous.tagName)) {
        const text = previous.textContent?.trim();
        if (text) {
          return `${text} table`;
        }
      }
      previous = previous.previousElementSibling;
    }

    const cardHeading = table.closest(".card")?.querySelector("h2, h3");
    const cardHeadingText = cardHeading?.textContent?.trim();
    if (cardHeadingText) {
      return `${cardHeadingText} table`;
    }

    return `Scrollable table ${index + 1}`;
  };

  const applyDesignSystemTables = () => {
    const tables = document.querySelectorAll("table");

    tables.forEach((table, index) => {
      table.classList.add("table");
      const ariaLabel = getTableLabel(table, index);

      if (table.parentElement?.classList.contains("table-wrap")) {
        table.parentElement.setAttribute("tabindex", "0");
        table.parentElement.setAttribute("role", "region");
        table.parentElement.setAttribute("aria-label", ariaLabel);
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "table-wrap";
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", ariaLabel);
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  };

  const LOCALE_STORAGE_KEY = "spanishLessonsPreferredLocale";
  const WEEK_SEGMENT = /^Week_\d+_Spanish_Lesson$/;

  // Inject an English <-> Traditional Chinese toggle into the per-page nav so a
  // learner can switch the language of the document they are reading (the index
  // page has its own dropdown). Works on both /Week_*/ and /tw/Week_*/ paths by
  // toggling the "tw" segment that precedes the week folder.
  const injectLanguageToggle = () => {
    const nav = document.querySelector(".top-nav");
    if (!nav || nav.querySelector(".lang-toggle")) {
      return;
    }

    const segments = window.location.pathname.split("/");
    const weekIndex = segments.findIndex((segment) => WEEK_SEGMENT.test(segment));
    if (weekIndex === -1) {
      return;
    }

    const isTw = segments[weekIndex - 1] === "tw";
    const targetSegments = segments.slice();
    if (isTw) {
      targetSegments.splice(weekIndex - 1, 1);
    } else {
      targetSegments.splice(weekIndex, 0, "tw");
    }

    const targetLocale = isTw ? "en" : "tw";
    const href = targetSegments.join("/") + window.location.hash;

    const toggle = document.createElement("a");
    toggle.className = "home-link lang-toggle";
    toggle.href = href;
    toggle.textContent = isTw ? "English" : "中文";
    toggle.setAttribute("lang", isTw ? "en" : "zh-Hant");
    toggle.setAttribute(
      "aria-label",
      isTw ? "View this page in English" : "以繁體中文檢視此頁面"
    );
    toggle.addEventListener("click", () => {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, targetLocale);
      } catch (_error) {
        // Ignore storage failures and continue with navigation.
      }
    });

    nav.appendChild(toggle);
  };

  const init = () => {
    applyDesignSystemTables();
    injectLanguageToggle();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
    return;
  }

  init();
})();

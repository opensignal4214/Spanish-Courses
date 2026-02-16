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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDesignSystemTables);
    return;
  }

  applyDesignSystemTables();
})();

/**
 * Renderer class
 *
 * Renders the formatted song body to HTML
 */

import "./styles/styles.scss";

const Renderer = {
  escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  },
  render(songBody) {
    return `
        <div class="chord-plus">
            ${songBody
              .map((item) => {
                if (!item.type) return "";

                if (item.type === "break") return "<div></div>";
                else
                  return `
                <div class="chord-plus__item ${item.type === "section" ? "chord-plus__item--section" : ""}">
                    ${item.type === "section" ? `<div class="chord-plus__section">${this.escapeHTML(item.value)}</div>` : ""}

                    <div class="chord-plus__item-container">
                        ${
                          item.type === "chord"
                            ? `
                        <div class="chord-plus__item-content chord">
                            <div class="chord-value">${item.value ? item.value : "&nbsp;"}</div>

                            ${
                              item.timing
                                ? `
                            <div class="timing">${item.timing}</div>
                            `
                                : ""
                            }
                        </div>
                        `
                            : ""
                        }

                        ${
                          item.type === "symbol" || item.type === "repeat"
                            ? `
                            <span class="chord-plus__item-content symbol">${this.escapeHTML(item.value)}</span>
                            `
                            : ""
                        }

                        ${
                          item.type === "comment"
                            ? `
                            <span class="chord-plus__item-content comment">${this.escapeHTML(item.value)}</span>
                            `
                            : ""
                        }

                        ${
                          item.type === "label"
                            ? `
                            <span class="chord-plus__item-content label">${this.escapeHTML(item.value)}</span>
                            `
                            : ""
                        }

                        ${
                          item.times
                            ? `
                            <span class="chord-plus__item-content repeat">x${this.escapeHTML(item.times)}</span>
                            `
                            : ""
                        }

                        ${
                          item.type === "rest"
                            ? `
                            <span class="chord-plus__item-content chord">
							    <div class="timing timing--rest">${item.timing}</div>
						    </span>
                            `
                            : ""
                        }
                    </div>
                </div>`;
              })
              .join("")}
        </div>
    `;
  },
};

export default Renderer;

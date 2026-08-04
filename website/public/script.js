const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");
const setupRequest = document.querySelector("#setup-request");

function closeNavigation() {
  if (!navToggle || !nav) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Copy command failed");
}

if (copyButton && copyStatus && setupRequest) {
  copyButton.addEventListener("click", async () => {
    const originalLabel = copyButton.textContent.trim();

    try {
      await copyText(setupRequest.textContent.trim());
      copyButton.textContent = "Copied";
      copyStatus.textContent = "Setup request copied to your clipboard.";
    } catch {
      copyStatus.textContent = "Copy failed. Select the request above and copy it manually.";
    }

    window.setTimeout(() => {
      copyButton.textContent = originalLabel;
      copyStatus.textContent = "";
    }, 1800);
  });
}

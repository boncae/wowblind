const langButton = document.querySelector(".lang-switch");
const nav = document.querySelector(".main-nav");
const menuToggle = document.querySelector(".menu-toggle");
let language = "ko";

function setLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-ko][data-en]").forEach((element) => {
    element.innerHTML = element.dataset[language];
  });
  const langKo = document.querySelector(".lang-ko");
  const langEn = document.querySelector(".lang-en");
  if (langKo) langKo.classList.toggle("muted", language !== "ko");
  if (langEn) langEn.classList.toggle("muted", language !== "en");
}

if (langButton) langButton.addEventListener("click", () => setLanguage(language === "ko" ? "en" : "ko"));
if (menuToggle && nav) menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    if (nav) nav.classList.remove("open");
  });
});

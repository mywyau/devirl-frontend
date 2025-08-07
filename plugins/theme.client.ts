import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

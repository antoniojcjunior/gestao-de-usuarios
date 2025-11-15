export async function includeHTML() {
  const includes = document.querySelectorAll("[data-include]");

  for (const el of includes) {
    const file = el.getAttribute("data-include");
    try {
      const response = await fetch(file);
      const html = await response.text();
      el.innerHTML = html;
    } catch (err) {
      el.innerHTML = "<p>Erro ao carregar componente.</p>";
      console.error("Erro carregando:", file, err);
    }
  }
}
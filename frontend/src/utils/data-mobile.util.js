export function ajustarCampoDataParaMobile(dataInput) {
  
  if (!dataInput) return;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    // Desktop: continua como type="date", sem máscara
    return;
  }

  // 🔹 MOBILE: troca para texto para permitir digitação
  dataInput.type = 'text';

  // 🔹 Garante teclado numérico e limite de caracteres
  dataInput.setAttribute('inputmode', 'numeric');
  dataInput.setAttribute('maxlength', '10'); // dd/mm/aaaa
  if (!dataInput.placeholder) {
    dataInput.placeholder = 'dd/mm/aaaa';
  }

  // 🔹 Aplica máscara enquanto o usuário digita
  dataInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, ''); // só dígitos

    if (v.length > 8) v = v.slice(0, 8); // limita em ddmmaaaa

    if (v.length >= 5) {
      // dd/mm/aaaa
      e.target.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length >= 3) {
      // dd/mm
      e.target.value = `${v.slice(0, 2)}/${v.slice(2)}`;
    } else {
      // só dia (d ou dd)
      e.target.value = v;
    }
  });
}
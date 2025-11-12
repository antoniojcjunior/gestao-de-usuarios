export function preencherUFs() {
  const ufs = [ "AP","AL","AC","AM","BA","CE","DF","ES","GO","RJ","MT","MS","MG","PA","PB","PR","PE","PI","MA","RN","RS","RO","RR","SC","SP","SE","TO" ];
  const selectUF = document.getElementById("uf");
  if (selectUF) {
    selectUF.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    ufs.sort().forEach(sigla => {
      const option = document.createElement("option");
      option.value = sigla;
      option.textContent = sigla;
      selectUF.appendChild(option);
    });
  }
}


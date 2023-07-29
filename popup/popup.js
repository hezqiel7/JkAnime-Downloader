async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Función para enviar el mensaje al Content Script y ejecutar las descargas
async function handleSubmit(e) {
  e.preventDefault();
  const currentTab = await getCurrentTab();
  let url;

  // Si la URL no es de JkAnime entonces salimos de la función
  try {
    url = currentTab.url;
    if (!url) {
      throw new Error("Solo se permite descargar de JkAnime.net");
    }
  } catch (e) {
    console.error(e.message);
    return;
  }

  const message = {
    action: "runDownload",
    desde: form.elements.desde.value,
    hasta: form.elements.hasta.value,
    animeName: url.split("/")[3],
  };
  chrome.tabs.sendMessage(currentTab.id, message);
}

const form = document.forms[0];
form.addEventListener("submit", handleSubmit);

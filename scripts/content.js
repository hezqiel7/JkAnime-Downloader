// Enviamos un mensaje al script de fondo para iniciar la descarga
function startDownload(url, name) {
  const message = {
    action: "startDownload",
    url: url,
    name: name,
  };
  chrome.runtime.sendMessage(message);
}

async function fetchEpisode(episode_url) {
  try {
    const response = await fetch(episode_url);
    if (response.ok) {
      const data = await response.text();
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      const favButton = htmlDoc.getElementById("guardar-capitulo");
      const idEpisode = favButton.getAttribute("data-capitulo");
      const endpoint = `https://jkanime.net/ajax/download_episode/${idEpisode}/`;

      const downloadResponse = await fetch(endpoint);
      if (downloadResponse.ok) {
        const downloadData = await downloadResponse.json();
        const url = downloadData.url;
        const name = downloadData.nombre;
        startDownload(url, name);
        return false; // No hay error
      } else {
        throw new Error("Error en la petición de descarga");
      }
    } else {
      throw new Error("Error en la petición");
    }
  } catch (error) {
    console.info("Todos los capítulos descargados");
    return true; // Hubo un error
  }
}

async function runDownload() {
  const currentUrl = window.location.href.split("/");
  let episode = currentUrl[4];
  const anime_name = currentUrl[3];
  let flag_error = false;

  while (!flag_error) {
    let episode_url = `https://jkanime.net/${anime_name}/${episode}/`;
    console.log(episode_url);
    flag_error = await fetchEpisode(episode_url);
    episode++;
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "runDownload") {
    runDownload();
  }
});

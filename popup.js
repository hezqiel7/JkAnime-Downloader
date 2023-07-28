// Agregar el event listener cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Función para enviar un mensaje al Content Script y ejecutar las descargas
  function handleClickDownload() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "runDownload" });
    });
  }

  const downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", handleClickDownload);
});

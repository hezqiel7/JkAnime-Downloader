chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startDownload") {
    const downloadOptions = {
      url: message.url,
      filename: message.name,
      conflictAction: "uniquify",
      saveAs: false,
    };

    chrome.downloads.download(downloadOptions, function (downloadId) {
      if (chrome.runtime.lastError) {
        console.error(
          "Error al iniciar la descarga: " + chrome.runtime.lastError.message
        );
      } else {
        console.log("Descarga iniciada con ID: " + downloadId);
      }
    });
  }
});

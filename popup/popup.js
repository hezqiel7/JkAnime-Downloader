async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getAnimeName() {
  const currentTab = await getCurrentTab();
  const url = currentTab.url;
  if (!url) {
    // Si la URL no es de JkAnime da undefined
    throw new Error("Solo se permite descargar de JkAnime.net");
  }

  const animeName = url.split("/")[3];
  return animeName;
}

// Función para enviar el mensaje al Content Script y ejecutar las descargas
async function handleSubmit(e) {
  e.preventDefault();

  const message = {
    action: "runDownload",
    desde: form.elements.desde.value,
    hasta: form.elements.hasta.value,
    animeName: animeName,
  };

  const currentTab = await getCurrentTab();
  chrome.tabs.sendMessage(currentTab.id, message);
}

// Manejar submit
const form = document.forms[0];
form.addEventListener("submit", handleSubmit);

// Obtener titulo
const titulo = document.getElementById("animeName");

let animeName;
try {
  animeName = await getAnimeName();
} catch (e) {
  console.error(e.message);
}

titulo.textContent = animeName.replace(/-/g, " ").toUpperCase();

// Manejar checkbox
const final = document.getElementById("final");

final.addEventListener("change", () => {
  const hasta = document.getElementById("hasta");
  if (final.checked) {
    hasta.setAttribute("disabled", "");
    hasta.value = "";
  } else {
    hasta.removeAttribute("disabled");
    hasta.value = document.getElementById("desde").value;
  }
});

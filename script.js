async function sendVideo() {
  const fileInput = document.getElementById("videoFile");
  const status = document.getElementById("status");
  const lang = document.getElementById("language").value;

  if (!fileInput.files.length) {
    alert("Видео таңдаңыз!");
    return;
  }

  status.innerText = "⏳ Видео серверге жіберілуде...";

  const formData = new FormData();
  formData.append("video", fileInput.files[0]);
  formData.append("language", lang);

  try {
    const response = await fetch(
      "https://autosub-backend.onrender.com/transcribe",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Backend жауап бермеді");
    }

    const result = await response.json();

    const txt = result.data[0];
    const srt = result.data[1];
    const burned = result.data[2];

    status.innerHTML = `
      ✅ Дайын!<br><br>
      📄 <a href="${txt}" target="_blank">Транскрипция (.txt)</a><br>
      🎬 <a href="${srt}" target="_blank">Субтитр (.srt)</a>
    `;

    if (burned) {
      status.innerHTML += `<br>🔥 <a href="${burned}" target="_blank">Burn-in видео</a>`;
    }

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Backend-пен байланыс орнамады.";
  }
}

async function sendVideo() {
  const fileInput = document.getElementById("videoFile");
  const status = document.getElementById("status");
  const lang = document.getElementById("language").value;

  if (fileInput.files.length === 0) {
    alert("Видео таңдаңыз!");
    return;
  }

  status.innerText = "⏳ Видео өңделуде, күте тұрыңыз...";

  // 1) Видео base64-ке ауыстырамыз
  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  bytes.forEach((b) => binary += String.fromCharCode(b));
  const base64Video = btoa(binary);

  // 2) Gradio API payload
  const payload = {
    data: [
      {
        name: file.name,
        data: base64Video
      },
      lang,
      true,   // punctuation
      false,  // burn subtitles
      ""      // font path
    ]
  };

  try {
    const response = await fetch(
      "https://huggingface.co/spaces/Nuruk/autosub-app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    // Gradio outputs
    const txtFile = result.data[0];
    const srtFile = result.data[1];
    const burnedVideo = result.data[2];

    status.innerHTML = `
      ✅ Дайын! <br><br>
      📄 <a href="${txtFile}" target="_blank">Транскрипция (.txt)</a><br>
      🎬 <a href="${srtFile}" target="_blank">Субтитр (.srt)</a>
    `;

    if (burnedVideo) {
      status.innerHTML += `<br>🔥 <a href="${burnedVideo}" target="_blank">Burn-in видео</a>`;
    }

  } catch (e) {
    console.error(e);
    status.innerText = "❌ Қате шықты. Hugging Face-пен байланыс болмады.";
  }
}

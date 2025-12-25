async function sendVideo() {
  const fileInput = document.getElementById("videoFile");
  const status = document.getElementById("status");
  const lang = document.getElementById("language").value;

  if (fileInput.files.length === 0) {
    alert("Видео таңдаңыз!");
    return;
  }

  status.innerText = "⏳ Видео Hugging Face Server-ге жіберілуде...";

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  const payload = {
    data: [
      {
        name: file.name,
        data: base64
      },
      lang,
      true,   // punctuation
      false,  // burn subtitles
      ""      // font path
    ]
  };

  try {
    const response = await fetch(
      "https://huggingface.co/spaces/Nuruk/autosub-app/api/predict",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("API жауап бермей жатыр!");
    }

    const result = await response.json();

    // Gradio шығаратын файл сілтемелері
    const txt = result.data[0];  // транскрипция .txt
    const srt = result.data[1];  // субтитр .srt
    const burned = result.data[2]; // burn-in видео

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
    status.innerText = "❌ Hugging Face API-мен байланыс орнамады.";
  }
}

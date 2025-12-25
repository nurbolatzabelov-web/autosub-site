async function sendVideo() {
  const fileInput = document.getElementById("videoFile");
  const status = document.getElementById("status");
  const lang = document.getElementById("language").value;

  if (fileInput.files.length === 0) {
    alert("Видео таңдаңыз!");
    return;
  }

  status.innerText = "Видео өңделуде, күте тұрыңыз...";

  const formData = new FormData();
  formData.append("video", fileInput.files[0]);
  formData.append("language", lang);

  try {
    const response = await fetch(
      "https://YOUR-HUGGINGFACE-SPACE.hf.space/run/predict",
      {
        method: "POST",
        body: JSON.stringify({
          data: [null]
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    status.innerText = "Дайын! Hugging Face арқылы өңделді.";
  } catch (e) {
    status.innerText = "Қате шықты. Кейін қайталап көріңіз.";
  }
}

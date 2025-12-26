from flask import Flask, request, jsonify
import whisper
import os

app = Flask(__name__)

model = whisper.load_model("base")

@app.route("/upload", methods=["POST"])
def upload():
    video = request.files["video"]
    lang = request.form["lang"]

    filename = "temp_video.mp4"
    video.save(filename)

    result = model.transcribe(
        filename,
        language=lang
    )

    os.remove(filename)

    return jsonify({
        "text": result["text"]
    })

if __name__ == "__main__":
    app.run(debug=True)


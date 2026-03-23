<script>
let recognition;
let isPressing = false;
let buffer = "";

const btn = document.getElementById("recordButton");
const preview = document.getElementById("preview");
const status = document.getElementById("status");

// ======================
// SpeechRecognition
// ======================
if (!('webkitSpeechRecognition' in window)) {
  status.textContent = "❌ Chromeで開いてください";
} else {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "ja-JP";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    if (!isPressing) return;

    const text = event.results[0][0].transcript;
    buffer += text + "\n";
    preview.textContent = buffer;
  };

  recognition.onerror = (e) => {
    console.error(e);
    status.textContent = "❌ 音声認識エラー";
  };
}

// ======================
// PTT（押してる間だけ）
// ======================
btn.addEventListener("pointerdown", () => {
  if (isPressing) return;

  isPressing = true;
  buffer = "";
  status.textContent = "🎤 録音中...";

  try {
    recognition.start();
  } catch(e) {}
});

btn.addEventListener("pointerup", async () => {
  if (!isPressing) return;

  isPressing = false;
  recognition.stop();
  status.textContent = "⏳ 保存中...";

  if (!buffer.trim()) {
    status.textContent = "⚠️ 空です";
    return;
  }

  const timestamp = new Date().toISOString();

  // Markdown生成
  const markdown = `# Voice Note

${buffer}

---
time: ${timestamp}
tag: voice
source: chrome
`;

  try {
    const res = await fetch("https://dreamgroove1.fuwafuwow.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "mysecret123"
      },
      body: JSON.stringify({
        content: buffer,
        tag: "voice",
        timestamp: timestamp
      })
    });

    const data = await res.json();

    status.textContent = "☁ 保存完了: " + data.file;

  } catch (e) {
    console.error(e);
    status.textContent = "❌ 保存失敗";
  }
});

// ======================
// Markdown手動保存（任意）
// ======================
document.getElementById("downloadButton").addEventListener("click", () => {
  const blob = new Blob([preview.textContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "voice.md";
  a.click();

  URL.revokeObjectURL(url);
});
</script>

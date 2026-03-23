async function onRecordingStop(markdownText) {
  const timestamp = new Date().toISOString();

  await fetch("https://dreamgroove1.fuwafuwow.workers.dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "mysecret123"
    },
    body: JSON.stringify({
      content: markdownText,
      tag: "voice",
      timestamp: timestamp
    })
  });
}

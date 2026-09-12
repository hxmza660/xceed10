let currentMode = "Explain";
const output = document.getElementById("aiOutput");
const status = document.getElementById("aiStatus");
const promptBox = document.getElementById("aiPrompt");
const askBtn = document.getElementById("askBtn");

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  promptBox.value = "";
  output.textContent = "Your answer will appear here.";
  status.textContent = "";
});

askBtn.addEventListener("click", async () => {
  const prompt = promptBox.value.trim();
  if (!prompt) {
    status.textContent = "Write a question or task first.";
    status.className = "ai-status danger";
    return;
  }
  if (!window.XCEED10_AI_ENDPOINT || window.XCEED10_AI_ENDPOINT === "PASTE_YOUR_BACKEND_URL_HERE") {
    status.textContent = "AI backend is not connected yet. See the setup note below.";
    status.className = "ai-status danger";
    output.textContent = "The page is ready, but it needs a secure backend endpoint before it can call Gemini. Do not put an API key in this file.";
    return;
  }
  askBtn.disabled = true;
  status.textContent = "Thinking…";
  status.className = "ai-status muted";
  output.textContent = "";
  try {
    const res = await fetch(window.XCEED10_AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: currentMode, prompt })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI request failed");
    output.textContent = data.text || "No response received.";
    status.textContent = "Ready";
    status.className = "ai-status success";
  } catch (err) {
    status.textContent = err.message || "Something went wrong.";
    status.className = "ai-status danger";
    output.textContent = "Try again after checking the backend connection.";
  } finally {
    askBtn.disabled = false;
  }
});

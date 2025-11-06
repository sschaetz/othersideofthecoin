import ky from "https://cdn.jsdelivr.net/npm/ky@1.7.2/distribution/index.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const api = ky.create({ prefixUrl: "/coin" });

  // --- Echo example ---
  const form = document.getElementById("post-coin-form");
  const input = document.getElementById("post-coin");
  const coin_result = document.getElementById("coin-result");

  const BRAILLE_FRAMES = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]; // classic
  const QUARTER_FRAMES = ["◐","◓","◑","◒"]; // fallback if braille looks odd in your font

  function startSpinner(el, frames = BRAILLE_FRAMES, intervalMs = 80) {
    let i = 0;
    el.setAttribute("aria-busy", "true");
    el.setAttribute("aria-live", "polite");
    const id = setInterval(() => {
      el.textContent = frames[i = (i + 1) % frames.length];
    }, intervalMs);
    return () => {
      clearInterval(id);
      el.removeAttribute("aria-busy");
    };
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const stop = startSpinner(coin_result); // or startSpinner(coin_result, QUARTER_FRAMES, 120)
    try {
      const data = await api.post("", {
        json: { text: input.value }
      }).json();
      const content = data?.choices?.[0]?.message?.content ?? "(no content)";
      stop();
      coin_result.textContent = content;
    } catch (err) {
      stop();
      coin_result.textContent = `Error: ${err.message}`;
    }
  });
});


import ky from "https://cdn.jsdelivr.net/npm/ky@1.7.2/distribution/index.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const api = ky.create({ prefixUrl: "/coin" });

  const form = document.getElementById("post-coin-form");
  const input = document.getElementById("post-coin");
  const coin_result = document.getElementById("coin-result");
  const coin_video = document.getElementById("coin-anim");

  // --- animation controls (video+poster) ---
  function start_anim() {
    // ensure policies won't block playback
    coin_video.muted = true;
    coin_video.playsInline = true;

    coin_video.loop = true;          // loop while we wait
    coin_video.currentTime = 0;      // start from frame 0 (poster)
    const p = coin_video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  function stop_anim_after_loop() {
    // finish current loop, then pause and reset to first frame
    coin_video.loop = false;
    const on_ended = () => {
      coin_video.pause();
      coin_video.currentTime = 0;    // show poster again
      coin_video.removeEventListener("ended", on_ended);
    };
    coin_video.addEventListener("ended", on_ended);
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    // show spinner *or* coin animation; here we use the coin
    start_anim();
    coin_result.textContent = "";    // clear previous result

    try {
      const data = await api.post("", { json: { text: input.value } }).json();
      const content = data?.choices?.[0]?.message?.content ?? "(no content)";
      stop_anim_after_loop();
      coin_result.textContent = content;
    } catch (err) {
      stop_anim_after_loop();
      coin_result.textContent = `Error: ${err.message}`;
    }
  });
});




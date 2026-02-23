const style = document.createElement('style');
style.textContent = `
  .sonnetBlocker {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 15, 15, 0.98);
    color: #e0e0e0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'Georgia', serif;
    font-size: 1.3rem;
    line-height: 1.6;
  }
  .poem-container {
    padding: 20px;
    max-height: 90%;
    overflow-y: auto;
  }
`;
document.head.appendChild(style);

const url = "https://poetrydb.org/title,random/Sonnet;1";

const getSonnet = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const poem = data[0];
    const lines = poem.lines.join("<br>");
    return `${lines}<br><br><strong>${poem.title}</strong><br>— ${poem.author}`;
  } catch (error) {
    return "Failed to load sonnet";
  }
};

let adStateActive = false;
let currentSonnetBlocker = null;
let standardPlaybackRate = 1.0;

const watchForAds = () => {
  const videoElement = document.querySelector("video");
  const videoPlayer = document.querySelector(".html5-video-player");
  const videoFrame = document.querySelector(".html5-video-container");

  if (!videoElement || !videoPlayer || !videoFrame) return;

  const isAdPlaying = videoPlayer.classList.contains("ad-showing");
  const skipButton = document.querySelector(".ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button");

  if (isAdPlaying) {
    if (skipButton) {
      skipButton.click();
    }

    if (!adStateActive) {
      adStateActive = true;
      videoElement.muted = true;
      if (!currentSonnetBlocker) {
        currentSonnetBlocker = document.createElement('div');
        currentSonnetBlocker.className = "sonnetBlocker";
        currentSonnetBlocker.innerHTML = `<div class="poem-container">Summoning the muses...</div>`;
        currentSonnetBlocker.appendChild(videoFrame);
        getSonnet().then(html => {
          const poemDisplay = currentSonnetBlocker.querySelector(".poem-container");
          if (poemDisplay) poemDisplay.innerHTML = html;
        });
      }
    }

  } else if (!isAdPlaying && adStateActive) {
    adStateActive = false;
    videoElement.muted = false;
    if (currentSonnetBlocker) {
      currentSonnetBlocker.remove();
      currentSonnetBlocker = null;
    }
  }
};

setInterval(watchForAds, 500);
console.log("Poetic Ad Blocker initialized.");

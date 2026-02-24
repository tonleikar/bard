const style = document.createElement('style');
style.textContent = `
  .sonnetBlocker {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(65, 65, 65, 0.5);
    color: #e0e0e0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    line-height: 1.5;
    backdrop-filter: blur(10px);
    }
    .poem-container {
      padding: 30px;
      max-height: 90%;
      overflow-y: auto;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(224, 224, 224, 0.2);
      border-radius: 20px;
      }
      `;

document.head.appendChild(style);

const url = "https://poetrydb.org/title,random/Sonnet;1";
let currentSonnetBlocker = null;
let standardPlaybackRate = 1.0;
const muteButton = document.querySelector('.ytp-volume-icon');

const getSonnet = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const poem = data[0];
    const lines = poem.lines.join("<br>");
    return `<strong>${poem.title}</strong><br>${poem.author}<br><br>${lines}`;
  } catch (error) {
    return "Failed to load sonnet";
  }
};

const createBlocker = () => {
  console.log("poeticAd: making block")
  const sonnetBlocker = document.createElement('div');
  sonnetBlocker.className = "sonnetBlocker";
  sonnetBlocker.innerHTML = `<div class="poem-container">trying to rhyme orange...</div>`;
  sonnetBlocker.addEventListener('click', removeBlocker)
  return sonnetBlocker
}

const removeBlocker = () => {
  console.log("poeticAd: removing block")
  const blocker = document.querySelector(".sonnetBlocker");
  if (blocker) {
    blocker.remove();
    currentSonnetBlocker = null;
  if (muteButton && muteButton.dataset.titleNoTooltip === "Unmute") {
      muteButton.click();

    }
  }
}

const clickButton = (btn) => {
  if (btn) {
  ['mousedown', 'mouseup', 'click'].forEach(eventType => {
    btn.dispatchEvent(new MouseEvent(eventType, {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1
    }));
  });
}
}


const adWatcher = () => {
  console.log("poeticAd monitoring started");

  const videoElement = document.querySelector("video");
  const isAdPlaying = document.querySelector('.ad-showing') !== null;
  const skipButton = document.querySelector(".ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button");

  console.log(skipButton);

  if (!videoElement) return;

  if (isAdPlaying) {
    console.log("poeticAd: ad is playing")
    if (muteButton && muteButton.dataset.titleNoTooltip === "Mute") {
      muteButton.click();
    }
    if (skipButton && skipButton.offsetParent !== null) {
      clickButton(skipButton);
    }
    if (!currentSonnetBlocker) {
        currentSonnetBlocker = createBlocker()
        document.body.insertAdjacentElement("afterbegin", currentSonnetBlocker)
        getSonnet().then(html => {
          const poemDisplay = document.querySelector(".poem-container");
          poemDisplay.innerHTML = html;
        });
      }
  } else if (!isAdPlaying) {
    removeBlocker();
  }
}

setInterval(adWatcher(), 500)

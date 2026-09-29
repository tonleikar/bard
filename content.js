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
    z-index: 2147483647;
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

let dismissedCurrentAd = false;
let currentSonnetBlocker = null;
let wasAdPlaying = false;
const muteButton = document.querySelector('.ytp-volume-icon');

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const getSonnet = async () => {
  const url = `https://poetrydb.org/linecount,random/${getRandomInt(3,15)};1`;
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
  console.log("bard: making block")
  const sonnetBlocker = document.createElement('div');
  sonnetBlocker.className = "sonnetBlocker";
  sonnetBlocker.innerHTML = `<div class="poem-container">trying to rhyme orange...</div>`;
  sonnetBlocker.addEventListener('click', () => {
    dismissedCurrentAd = true;
    removeBlocker();
  })
  return sonnetBlocker
}

// Clears the blocker element itself. Does NOT touch dismissedCurrentAd — that's
// only set by the manual click handler above, so an ad ending naturally doesn't
// leave dismissedCurrentAd stuck "true" and block the next ad break.
const removeBlocker = () => {
  console.log("bard: removing block")
  const blocker = document.querySelector(".sonnetBlocker");
  if (blocker) {
    blocker.remove();
    currentSonnetBlocker = null;
    if (muteButton && muteButton.dataset.titleNoTooltip === "Unmute") {
      muteButton.click();
    }
  }
}

const adWatcher = () => {
  const videoElement = document.querySelector("video");
  const isAdPlaying = !!document.querySelector('.ad-showing, .ad-interrupting');

  if (!videoElement) return;

  // A genuinely new ad break started — forget any earlier dismissal.
  if (isAdPlaying && !wasAdPlaying) {
    dismissedCurrentAd = false;
  }
  wasAdPlaying = isAdPlaying;

  if (isAdPlaying) {
    console.log("bard: ad is playing")
    if (muteButton && muteButton.dataset.titleNoTooltip === "Mute") {
      muteButton.click();
    }
    if (!dismissedCurrentAd && !currentSonnetBlocker) {
      currentSonnetBlocker = createBlocker()
      document.body.insertAdjacentElement("afterbegin", currentSonnetBlocker)
      getSonnet().then(html => {
        const poemDisplay = document.querySelector(".poem-container");
        if (poemDisplay) poemDisplay.innerHTML = html;
      });
    }
  } else {
    console.log("bard: No advert")
    removeBlocker();
  }
}


const getPlayerContainer = () => document.querySelector('.html5-video-player');

const observeAdState = () => {
  const player = getPlayerContainer();
  if (player) {
    adWatcher();
    new MutationObserver(adWatcher).observe(player, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return;
  }

  // Player isn't mounted yet (script ran before YouTube's player loaded) —
  // watch for it to appear, then attach the real observer above.
  const mountObserver = new MutationObserver(() => {
    const mountedPlayer = getPlayerContainer();
    if (mountedPlayer) {
      mountObserver.disconnect();
      observeAdState();
    }
  });
  mountObserver.observe(document.body, { childList: true, subtree: true });
};

observeAdState()

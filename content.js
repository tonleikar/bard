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

let currentSonnetBlocker = null;
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

const adWatcher = () => {
  console.log("poeticAd monitoring started");

  const videoElement = document.querySelector("video");
  const isAdPlaying = document.querySelector('.ad-showing, .ad-interrupting');

  // if (skipButton) {
  //   skipButton.click();
  //   removeBlocker();
  // }
  if (!videoElement) return;
  if (isAdPlaying) {
    console.log("poeticAd: ad is playing")
    if (muteButton && muteButton.dataset.titleNoTooltip === "Mute") {
      muteButton.click();
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
    console.log("poeticAd: No advert")
    removeBlocker();
  }
}

setInterval(adWatcher, 1000)


// TODO add itv x blocker:
//    video player: data-testid="video-wrapper" class="videoPlayerWrapper visible"
//    advert: class="advertPlayerA advertPlayerB"
//    < button class="cp_button cp_button--primary cp_button--small fe-mrphs__volume__button fe-mrphs__button fe-mrphs__button-iconOnly" tabindex = "4" data - testid="volumeButton" aria - label="Volume" aria - disabled="false" > <i class="cp_icon cp_icon__volume-mid cp_icon--base" aria-hidden="true"><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.00001C11 0.611994 10.7755 0.259002 10.4242 0.0944227C10.0728 -0.0701571 9.6579 -0.0166118 9.35982 0.231791L4.83797 4H1C0.447715 4 0 4.44772 0 5V12C0 12.5523 0.447715 13 1 13H4.83793L9.35982 16.7682C9.6579 17.0166 10.0728 17.0702 10.4242 16.9056C10.7755 16.741 11 16.388 11 16V1.00001ZM5.8402 5.76822L9 3.13506V13.865L5.84016 11.2318C5.66045 11.082 5.43392 11 5.19998 11H2V6H5.20002C5.43396 6 5.66049 5.91798 5.8402 5.76822Z" fill="currentColor"></path>    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4616 4.1573C13.927 3.85996 14.5454 3.9962 14.8427 4.46161C16.2152 6.60984 16.3774 9.35259 15.2732 11.657L14.9018 12.4321C14.6632 12.9302 14.0659 13.1405 13.5679 12.9018C13.0698 12.6632 12.8595 12.0659 13.0982 11.5679L13.4696 10.7928C14.2765 9.10882 14.1552 7.10041 13.1573 5.53839C12.86 5.07298 12.9962 4.45464 13.4616 4.1573Z" fill="currentColor"></path></svg></i></button >

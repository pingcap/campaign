import "styles/style.scss";

/*
  Library and Utility
 */
import "utils/template.js";
import "utils/html5tooltips.js";

document.body.addEventListener("touchstart", function() {});

const IS_VISITED_KEY = "visited_ga_day";
const CONTRI_GITHUB_NAME = "gaday-github-name";

const D = window.ContributorsData;
let ContriList = [];
const storage = window.localStorage;
let contriGithubName = storage ? storage.getItem(CONTRI_GITHUB_NAME) : null;

let timer, currentModal;

// render star wall
const renderMask = type => {
  document.getElementById("mask").setAttribute("style", "display: block");
  if (type === "authform") {
    document.getElementById("starwall").setAttribute("style", "display: none");
  }
  document.getElementById(type).setAttribute("style", "display: block");
  currentModal = type;
};
window.closeMask = () => {
  document.getElementById("mask").setAttribute("style", "display: none");
  if (currentModal === "starwall") {
    storage && storage.setItem(IS_VISITED_KEY, true);
  }
  if (currentModal === "authform") {
  }
  timer && clearTimeout(timer);
};

const visited = storage ? storage.getItem(IS_VISITED_KEY) : false;
console.log(IS_VISITED_KEY, visited);
if (!visited) {
  renderMask("starwall");
  // TODO: time to calculate
  timer = setTimeout(() => {
    renderMask("authform");
    storage && storage.setItem(IS_VISITED_KEY, true);
  }, 1000 * 20);
} else {
  if (!contriGithubName) {
    renderMask("authform");
  }
}

window.handleAuthFormClick = type => {
  contriGithubName = document.getElementById("github-id").value;
  if (type === "contributor" && !contriGithubName) return;

  storage && storage.setItem(CONTRI_GITHUB_NAME, contriGithubName);
  lightContriPixel(contriGithubName);
  closeMask();
  // switch (target.id) {
  //   case "btn-auth":
  //     break;
  //   case "btn-later":
  //     break;
};

// transform data to structure for rendering
const isMobile = false; // isPc Todo
{
  Object.keys(D).forEach(k => {
    Object.keys(D[k].repos).forEach(r => {
      ContriList.push({
        name: k,
        avatar: D[k].avatar,
        repo: r,
        level: D[k].repos[r]
      });
    });
  });
  console.log("ContriList length:", ContriList.length); // 400

  const rowPixelCount = isMobile ? 17 : 32;
  const spacePixelCount =
    Math.ceil(ContriList.length / rowPixelCount) * rowPixelCount -
    ContriList.length;
  console.log("spacePixelCount length:", spacePixelCount); // 400
  Array(spacePixelCount)
    .fill({})
    .forEach(i => {
      ContriList.push({
        name: `space-${i}`,
        repo: null,
        level: 0
      });
    });

  ContriList = shuffleArray(ContriList).map((i, idx) => {
    i.idx = idx;
    return i;
  });
  // console.log("ContriList for render is ", ContriList);
}
// end transform

// render dbox
{
  const dboxHtml = window.tmpl(
    `<div class="gaday-dbox" id="gaday-dbox"><% data.forEach((i)=>{ %><div class="mosaic-rect level-<%= i.level %>" id="pixel-id-<%= i.idx %>"></div> <% }) ;%></div>`
  )({
    data: ContriList
  });
  document.getElementById("mosaic").innerHTML = dboxHtml;
  contriGithubName && lightContriPixel(contriGithubName);
}
// end render dbox

// after user fill form - pickup user contributors
function lightContriPixel(name) {
  const $head = document.querySelector(".contributor-info");

  const visitorContriList = ContriList.filter(i => i.name === name);
  if (visitorContriList.length) {
    let infoHtml = `<span>Contributor @ </span><span id="name"> ${name} </span>`;
    visitorContriList.forEach(i => {
      infoHtml += `<span class="mosaic-rect level-${i.level}"></span>${i.repo}`;
      document.getElementById(
        `pixel-id-${i.idx}`
      ).innerHTML = `<span>${i.repo}</span>`;
    });
    $head.innerHTML = infoHtml;
  } else {
    // welcome bro - for newbie
    $head.innerHTML = `welcome bro - for newbie`;
  }
}

// add hover handler for pixel
{
  const $dbox = document.getElementById("gaday-dbox");
  const $pixels = $dbox.querySelectorAll(".mosaic-rect");
  const $tooltip = new HTML5TooltipUIComponent();
  $tooltip.set({
    // animateFunction: "spin",
    disableAnimation: true,
    delay: 100,
    color: "charcoal",
    contentText: "....",
    stickTo: "top"
  });
  $tooltip.mount();

  function setAndShowToolTip(e) {
    if (e.target.classList.contains("mosaic-rect")) {
      const pixelId = e.target.id.replace("pixel-id-", "");
      const { avatar, repo, level, name } = ContriList[pixelId];

      if (avatar) {
        e.target.style.backgroundImage = `url(${avatar})`;
      }

      const copyright = repo ? `${repo} - ${name}` : "Welcome to join us";

      $tooltip.set({
        target: e.target,
        contentText: copyright
      });
      $tooltip.show();
    }
  }

  function hideTooltip(e) {
    $tooltip.hide();
    e && (e.target.style.backgroundImage = null);
  }

  for (var i = 0; i < $pixels.length; i++) {
    $pixels[i].addEventListener(
      "mouseover",
      function(e) {
        setAndShowToolTip(e);
      },
      false
    );

    $pixels[i].addEventListener(
      "mouseleave",
      function(e) {
        if (e.target.classList.contains("mosaic-rect")) {
          hideTooltip(e);
        }
        // tooltip.show();
      },
      false
    );
  }

  $dbox.addEventListener(
    "touchstart",
    e => {
      $tooltip.hide();
      setAndShowToolTip(e);
      setTimeout(e => {
        (e => {
          hideTooltip(e);
        })(e);
      }, 3000);
    },
    false
  );
}
// end add hover handler

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

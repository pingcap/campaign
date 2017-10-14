import "styles/style.scss";

document.body.addEventListener("touchstart", function() {});

// import "utils/zepto.min.js";
import "utils/template.js";
import "utils/html5tooltips.js";

const D = window.ContributorsData;

let storage = window.localStorage;
const IS_VISITED_KEY = 'visited_ga_day';
let username = {};
var timer;

// render star wall
const renderStarwall = () => {
  console.log("setAttribute", document.getElementById("mask"))
  document.getElementById("mask").setAttribute('style','display: block');
  document.getElementById("starwall").setAttribute('style','display: block');
}

// render auth form
const renderAuthForm = () => {}

if (!storage) {
    console.log('not support localStorage')
} else {
    const visited = storage.getItem(IS_VISITED_KEY)
    console.log(IS_VISITED_KEY, visited)
    if (!visited) {
      // render star wall
      storage.setItem(IS_VISITED_KEY, username)
      renderStarwall();
      timer = setTimeout(renderAuthForm(), 3000)
    } else {

    }
}

window.closeMask = () => {
  document.getElementById("mask").setAttribute('style','display: none');
  clearTimeout(timer)
}


// transform data to structure for rendering
const isMobile = false; // isPc
let ContriList = [];
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
// random it contrilist

// end transform

// render dbox
const dboxHtml = window.tmpl(
    `<div class="gaday-dbox" id="gaday-dbox"><% data.forEach((i)=>{ %><div class="mosaic-rect level-<%= i.level %>" id="pixel-id-<%= i.idx %>"></div> <% }) ;%></div>`
)({
    data: ContriList
});
// console.log(dboxHtml);
document.getElementById("mosaic").innerHTML = dboxHtml;

// end render

// after user fill form - pickup user contributors
const visitorName = "queenypingcap";
const visitorContriList = ContriList.filter(i => i.name === visitorName);
if (visitorContriList.length) {
    visitorContriList.forEach(i => {
        document.getElementById(
            `pixel-id-${i.idx}`
        ).innerHTML = `<span>${i.repo}</span>`;
    });
} else {
    // welcome bro - for newbie
}

// add hover handler for pixel
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
      console.log(e.target);
      setAndShowToolTip(e);
    },
    false
  );

  $pixels[i].addEventListener(
    "mouseleave",
    function(e) {
      console.log(e.target);
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
    console.log(e.target);
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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

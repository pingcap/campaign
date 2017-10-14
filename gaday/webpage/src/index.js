import "styles/style.scss";
import "styles/cal-heatmap.scss";

document.body.addEventListener("touchstart", function() {});

import "utils/heatmap.js";
// import "utils/zepto.min.js";
import "utils/template.js";

const D = window.ContributorsData;

// transform data to structure for rendering
const isMobile = true; // isPc
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

const rowPixelCount = isMobile ? 20 : 25;
const spacePixelCount =
  Math.ceil(ContriList.length / rowPixelCount) * rowPixelCount -
  ContriList.length;
console.log("spacePixelCount length:", spacePixelCount); // 400
Array(spacePixelCount).forEach(i => {
  ContriList.push({
    name: `space-${i}`,
    repo: null
  });
});

ContriList = shuffleArray(ContriList).map((i, idx) => {
  i.idx = idx;
  return i;
});
console.log("ContriList for render is ", ContriList);
// random it contrilist

// end transform

// render dbox

console.log(
  window.tmpl(
    `<div class="gaday-dbox" id="gaday-dbox"><% data.forEach((i)=>{ %><div class="contri-level-<%= i.level %>" id="pixel-id-<%= i.idx %>"><%= i.name %></div> <% }) ;%></div>`
  )({
    data: ContriList
  })
);

// end render

// after user fill form - pickup user contributors
const visitorName = "queenypingcapx";
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

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

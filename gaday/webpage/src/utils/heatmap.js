var f = s => (
  (n = y => d.setDate(d.getDate() + y)),
  (d = new Date()),
  (h = d.getDay()) && n(7 - h),
  (r = {}),
  (i = 0),
  [...s].map(c => {
    c < "!"
      ? n(14)
      : ([
          ...parseInt(
            "jn4x733nx8gjw6nhricv6nx8dpz2vilui81vikl7b4nhridnzvgc1svznx8dji8g16fkg0vgc6341vg38oe9vh669ofvgm1dvjnhricvyvikl7aonhrjrjxvikmm29m0rqqp2nqmi6o0vbnf6dav2t14e4vbnjqpqs0g34o3tlqqwdso43oixtg1uyt8vvgddxn2hizrn2ahizrmdbhj4suq4gtytq8wgshvtzyvgc4mq7gzhwhz4g15ymf4vg72q9snx7r2f4jmffjm7jm5gavjhizrn2mjmkh3wogsgmianjm5gavcgwxpc3mhvni2kijhgqujjj8mcsgsjhgslnihw2cx75iqyv1cuhwdrh5d".substr(
              (c.charCodeAt() - (c > "`" ? 71 : 65)) * 7,
              7
            ),
            36
          )
            .toString(2)
            .slice(1)
            .replace(/(0{7})+$/, "")
        ].map(b => (+b && (r[+d] = r[+d] ? 9 : i % 2 ? 6 : 3), n(1))),
        i++,
        n(-7));
  }),
  Object.keys(r)
    .map(k => [k, r[k]])
    .sort((i, j) => (i[0] - j[0] > 0 ? 1 : -1))
    .map(i => [(new Date(+i[0]) + "").slice(4, 15), i[1]])
);

const infoEl = $("#info");
const inputEl = $("#text");
const outputEl = $("#output");
let infoTimeout, scrollTimeout;

function heatmap(text) {
  $("#heatmap")
    .html("")
    .attr("style", "");

  text = text.replace(/[^a-z]/gi, " ");

  if (text.trim().length === 0) return [];

  const dataArray = f(text);

  const first = new Date(dataArray[0][0]);
  const last = new Date(dataArray[dataArray.length - 1][0]);
  let range =
    Math.ceil((last - first) / 1000 / 60 / 60 / 24 / 7) +
    text.match(/ *$/)[0].length +
    1;

  let data = {};
  dataArray.forEach(i => {
    data[(+new Date(i[0]) / 1000) | 0] = +i[1];
  });

  let start = new Date();
  if (start.getDay() > 0) start.setDate(start.getDate() + 7 - start.getDay());

  let lastMonth = -1;
  let lastYear = -1;

  const timerStart = Date.now();

  const cal = new CalHeatMap();
  cal.init({
    itemSelector: "#heatmap",
    start,
    data,
    range,
    rowLimit: 7,
    domainGutter: 0,
    domain: "week",
    subDomain: "day",
    legend: [0, 3, 6, 9],
    weekStartOnMonday: false,
    tooltip: true,
    domainLabelFormat: date => {
      if (date.getMonth() === lastMonth) return "";
      lastMonth = date.getMonth();
      const yearPart =
        date.getYear() === lastYear ? "" : date.toDateString().slice(-2);
      lastYear = date.getYear();
      return date.toDateString().split(" ")[1] + " " + yearPart;
    },
    cellSize: 30,
    animationDuration: 0,
    legendVerticalPosition: "bottom",
    legendHorizontalPosition: "left",
    onComplete: () => {
      clearTimeout(infoTimeout);
      infoEl.html(`Done in ${Date.now() - timerStart}ms`);
      infoTimeout = setTimeout(() => infoEl.html(""), 1500);

      const heatmapWrap = $("#heatmap-wrap")[0];
      scrollTimeout = setTimeout(
        () => (heatmapWrap.scrollLeft = heatmapWrap.scrollWidth),
        50
      );
    }
  });

  return dataArray;
}

inputEl
  .on("input", function() {
    const dataArray = heatmap(this.value);

    $("#heatmap-yAxisLabels, #output table, #output pre").css(
      "visibility",
      this.value.length > 0 ? "visible" : "hidden"
    );

    if (dataArray === undefined) return;

    // outputEl.find("tbody").html(dataArray.map(i => `<tr><td>${i[0]}</td><td class="r${(i[1]/3|0)+1}">${i[1]}</td></tr>`).join(""));
    // outputEl.find("pre").html(dataArray.map(i=>i.join(": ")).join("\n"));
  })
  .val("Hello World")
  .trigger("input");

const $file = document.getElementById("file");
const $main = document.getElementById("main");

function createOption(file) {
  const option = {
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 80,
        end: 100,
        xAxisIndex: [0, 1],
      },
      {
        type: "inside",
        realtime: true,
        start: 80,
        end: 100,
        xAxisIndex: [0, 1],
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    yAxis: {},
    xAxis: {
      data: [],
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: [],
      },
    ],
  };

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const day = 86400000;
      const result = [];
      const lines = reader.result.split("\n");
      for (let index = 0; index < lines.length; index++) {
        const item = lines[index];
        if (!item) continue;
        const { createdAt, updatedAt } = JSON.parse(item);
        const date = createdAt || updatedAt;
        if (result.length === 0) {
          result.push([date]);
        } else {
          const last = result[result.length - 1];
          if (last[0] + day > date) {
            last.push(date);
          } else {
            result.push([date]);
          }
        }
      }
      option.xAxis.data = result.map((item) =>
        window["dayjs"](item[0]).format("YYYY-MM-DD")
      );
      option.series[0].data = result.map((item) => item.length);
      resolve(option);
    };
  });
}

$file.onchange = async ({
  target: {
    files: [file],
  },
}) => {
  if (!file || !file.name.toLowerCase().endsWith(".json")) return;
  if (window["chart"]) window["chart"].dispose();
  window["chart"] = window["echarts"].init($main);
  const option = await createOption(file);
  window["chart"].setOption(option);
};

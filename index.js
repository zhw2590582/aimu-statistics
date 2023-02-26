const $file = document.getElementById("file");
const $main = document.getElementById("main");

function createOption(file) {
  const option = {
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 30,
        end: 70,
        xAxisIndex: [0, 1],
      },
      {
        type: "inside",
        realtime: true,
        start: 30,
        end: 70,
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
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    series: [
      {
        type: "line",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      console.log(reader.result);
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

const URL = "http://localhost:3000/prices";

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("play-button").addEventListener("click", () => {
    let chartContainer = document.getElementById("chart");
    chartContainer.innerHTML = `
    <canvas id="tradeChart" width="800" height="400"></canvas>`;
    fetchPrice(URL);
    document.getElementById("play-button").disabled = true;
  });
});

// fetch data from json backend - return array of price
function fetchPrice(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => render(data));
}
// parsing data
function render(data) {
  //listening to user click play button
  //pause 3s and start the game

  //create dataset
  let dataset = [];
  for (let i = 0; i < data.length; i++) {
    const el = { time: i, price: data[i] };
    dataset.push(el);
  }

  //render chart
  let i = 0;
  let myInt = setInterval(() => {
    let newDataSet = dataset.slice(0, i + 1);
    console.log(newDataSet);
    drawChart(newDataSet, i);
    i++;

    if (i === 29) {
      clearInterval(myInt);
    }
  }, 1000);
}

// draw chart with json data
function drawChart(data) {
  let ctx = document.getElementById("tradeChart");
  // console.log(data.map(el => el.time));
  let dataset = {
    labels: data.map(el => el.time),
    datasets: [
      {
        data: data.map(el => el.price),
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff"
      }
    ]
  };
  let myLineChart = new Chart(ctx, {
    type: "line",
    data: dataset,
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              fixedStepSize: 20,
              fontSize: 10
            },
            scaleLabel: {
              display: true,
              labelString: "Price($)"
            }
          }
        ],

        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Time (s)"
            },
            ticks: {
              fontSize: 10,
              max: 60,
              min: 0,
              stepSize: 1
            }
          }
        ]
      },
      responsive: false,
      maintainAspectRatio: true,
      animation: { duration: 0 }
    }
  });
}
// Update chart with new data
function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(data);
  });
  chart.update();
}

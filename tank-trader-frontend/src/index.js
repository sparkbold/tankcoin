const URL = "http://localhost:3000/games";

document.addEventListener("DOMContentLoaded", function () {
  //---------Start Game button---------------//
  document.getElementById("play-button").addEventListener("click", () => {
    let chartContainer = document.getElementById("chart");
    chartContainer.innerHTML = `
    <canvas id="tradeChart" width="800" height="400"></canvas>`;
    fetchPrice(URL);
    document.getElementById("play-button").disabled = true;
  });
});

// --------fetch data from json backend------//
function fetchPrice(url) {
  fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => render(data.prices));
}

// -----------------render chart------------//
function render(data) {
  //create dataset
  let dataset = [];
  for (let i = 0; i < data.length; i++) {
    const el = {
      time: i,
      price: data[i].value
    };
    dataset.push(el);
  }

  //render chart
  let i = 0;
  let myInt = setInterval(() => {
    let newDataSet = dataset.slice(0, i + 1);
    // console.log(newDataSet);
    drawChart(newDataSet);
    i++;

    if (i === 59) {
      clearInterval(myInt);
    }
  }, 1000);
}

// ---------------draw Chart---------------------//
function drawChart(data) {
  let ctx = document.getElementById("tradeChart");

  let dataset = {
    labels: data.map(el => (el = "")),
    datasets: [{
      data: data.map(el => el.price),
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff"
    }]
  };
  console.log(dataset);
  let myLineChart = new Chart(ctx, {
    type: "line",
    data: dataset,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      events: ["click"],
      responsive: true,
      animation: {
        duration: 0
      }
    }
  });
}

//----------create events--------------//
function createEvents() {}

//----------create user--------------//
function createUser() {}

//--------save game-------------//
function saveGame() {}

// Update chart with new data
// function addData(chart, label, data) {
//   chart.data.labels.push(label);
//   chart.data.datasets.forEach(dataset => {
//     dataset.data.push(data);
//   });
//   chart.update();
// }
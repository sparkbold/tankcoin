const URL = "http://localhost:3000/games";

document.addEventListener("DOMContentLoaded", function() {
  buttonEventListener();
});

//----------global listener--------------//
function buttonEventListener() {
  document.addEventListener("click", event => {
    const timeStartGame = new Date().getTime() / 1000;
    if (event.target.name === "play-button") {
      let chartContainer = document.getElementById("chart");
      chartContainer.innerHTML = `
      <canvas id="tradeChart" width="800" height="400"></canvas>`;
      fetchPrice(URL); //<------start the game-------
      event.target.disabled = true;
    }

    if (event.target.name === "buy-button") {
      let priceIndexData = getData("priceIndex").slice();
      console.log(priceIndexData);
      // buyAction()
      // grab data-point at the time click
      const timeBuy = new Date().getTime() / 1000;
    }

    if (event.target.name === "sell-button") {
      // sellAction()
    }

    // debugger;
  });
}

// --------fetch data from json backend------//
function fetchPrice(url) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      user_name: "trung",
      num_of_events: Math.floor(Math.random() * 5) + 4
    })
  })
    .then(response => response.json())
    .then(data => console.log(data));
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
  storeData("priceIndex", dataset);

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
  console.log(dataset);
  let myLineChart = new Chart(ctx, {
    type: "line",
    data: dataset,
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      events: ["click"],
      responsive: true,
      animation: {
        duration: 0
      }
    }
  });
}
//----------create BUY/SELL---------------//

//----------create user--------------//
function createUser() {}

//--------save game-------------//
function saveGame() {}

// --------LOCALSTORAGE-----------//
function storeData(dataName, jsonDataset) {
  localStorage.setItem(dataName, JSON.stringify(jsonDataset));
}

function getData(dataName) {
  let data = localStorage.getItem(dataName);
  return JSON.parse(data);
}
// Update chart with new data
// function addData(chart, label, data) {
//   chart.data.labels.push(label);
//   chart.data.datasets.forEach(dataset => {
//     dataset.data.push(data);
//   });
//   chart.update();
// }

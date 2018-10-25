const gamesURL = "http://localhost:3000/games";
const usersURL = "http://localhost:3000/users";

TIMEINTERVAL = 0;
CURRENTPRICE = 0;
CASHVALUE = 1000;
SECURITIESVALUE = 0;
COSTBASIS = [];
PORTFOLIOVALUES = [];
CURRENTUSER = "";

document.addEventListener("DOMContentLoaded", function() {
  fetchUsers();
  addUserForm();
  buttonEventListener();
  updateStats();
});
// --------------GET ALL CURRENT USERS-----------//
function fetchUsers() {
  fetch(usersURL)
    .then(resp => resp.json())
    .then(users => storeData("allUsers", users));
}
//----------global listener--------------//
function buttonEventListener() {
  document.addEventListener("click", event => {
    let allUsers = getData("allUsers").map(el => el.user_name);
    // debugger;
    if (event.target.name === "login") {
      event.preventDefault();
      console.log(event.target.name);
      let username = event.target.form.elements.username.value.toLowerCase();

      if (username === "" || username === " ") {
        alert("Please type correct username: no space or empty");
      } else if (allUsers.includes(username)) {
        CURRENTUSER = username;
        document.getElementById("stats").style.display = "block";
        document.getElementById("buttons").style.display = "block";
        updateStats();
        console.log("found you!!", CURRENTUSER);
        document.getElementById("user-form").style.display = "none";
      } else {
        alert("User is not exist! Please create user!");
      }
    }

    if (event.target.name === "create") {
      event.preventDefault();
      console.log(event.target.name);
      let username = event.target.form.elements.username.value.toLowerCase();

      if (username === "" || username === " ") {
        alert("Please type correct username: no space or empty");
      } else if (allUsers.includes(username)) {
        alert("Username is already exist. Try again!");
      } else {
        CURRENTUSER = username.toLowerCase();
        document.getElementById("stats").style.display = "block";
        document.getElementById("buttons").style.display = "block";
        document.getElementById("user-form").style.display = "none";
        updateStats();
        fetch(usersURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            user_name: CURRENTUSER
          })
        });
      }
    }

    if (event.target.name === "play-button") {
      let priceChartContainer = document.getElementById("price-chart");
      let valueChartContainer = document.getElementById("value-chart");

      priceChartContainer.innerHTML = `
      <canvas id="tradeChart" width="800" height="400"></canvas>`;
      valueChartContainer.innerHTML = `
      <canvas id="valueChart" width="800" height="400"></canvas>`;

      fetchPrice(gamesURL, CURRENTUSER); //<------start the game-------
      event.target.disabled = true;
      setTimeout(() => {
        document.getElementById("buy-button").disabled = false;
        document.getElementById("buy-all").disabled = false;

        document.getElementById("sell-button").disabled = false;
        document.getElementById("sell-all").disabled = false;
      }, 1000);
    }

    //----------- buyAction--------------//
    if (event.target.name === "buy-button") {
      if (CASHVALUE > CURRENTPRICE) {
        COSTBASIS.push(CURRENTPRICE);
        CASHVALUE -= CURRENTPRICE;
        console.log(COSTBASIS, Math.round(CASHVALUE));
      } else {
        console.log("You dont have enough cash");
      }

      // console.log(priceIndexData);
      // grab data-point at the time click
    }

    if (event.target.name === "buy-all-button") {
      // buyAction()
      if (CASHVALUE > CURRENTPRICE) {
        let shares = Math.floor(CASHVALUE / CURRENTPRICE);
        for (let i = 1; i < shares; i++) {
          COSTBASIS.push(CURRENTPRICE);
        }

        CASHVALUE -= CURRENTPRICE * shares;
        console.log(COSTBASIS, Math.round(CASHVALUE));
      } else {
        console.log("You dont have enough cash");
      }
    }

    //------------- sellAction ---------------//
    if (event.target.name === "sell-button") {
      if (COSTBASIS.length > 0) {
        CASHVALUE += CURRENTPRICE;

        COSTBASIS.shift(CURRENTPRICE);
        console.log(COSTBASIS, Math.round(CASHVALUE));
      } else {
        console.log("You dont have stock to sell");
      }
    }

    if (event.target.name === "sell-all-button") {
      if (COSTBASIS.length > 0) {
        CASHVALUE += CURRENTPRICE * COSTBASIS.length;

        COSTBASIS.length = 0;
        console.log(COSTBASIS, Math.round(CASHVALUE));
      } else {
        console.log("You dont have stock to sell");
      }
    }
  });
}

// --------fetch data from json backend------//
function fetchPrice(url, username) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      user_name: username,
      num_of_events: Math.floor(Math.random() * 5) + 4
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      storeData("eventsData", data.game_events);
      storeData("events", data.events);
      storeData("game", data.game_id);

      valueData = [];

      priceIndex = data.prices.map(el => el.value);

      let price = 100,
        priceData = [];
      for (const el of priceIndex) {
        price = price * (1 + el);
        priceData.push(price);
      }
      return render(priceData);
    });
}
// -----------------creat dataset------------//
function createDataset(data) {
  //create dataset
  let dataset = [];
  for (let i = 0; i < data.length; i++) {
    const el = {
      time: i,
      price: data[i]
    };
    dataset.push(el);
  }

  return dataset;
}

// -----------------render chart------------//
function render(data) {
  let dataset = createDataset(data);
  storeData("priceIndex", dataset);
  let ctx = document.getElementById("tradeChart");
  let vtx = document.getElementById("valueChart");

  //render chart
  let i = 0;
  let myInt = setInterval(() => {
    TIMEINTERVAL = i;
    let newDataSet = dataset.slice(0, i + 1);
    CURRENTPRICE = newDataSet[i].price;
    SECURITIESVALUE = CURRENTPRICE * COSTBASIS.length;
    PORTFOLIOVALUES.push(SECURITIESVALUE + CASHVALUE);
    let newMVdataSet = createDataset(PORTFOLIOVALUES);
    // let newMVdataSet = marketValue.slice(0, i + 1);

    drawChart(ctx, newDataSet);
    drawChart(vtx, newMVdataSet);
    updateStats();

    i++;

    let eventData = getData("eventsData");
    let events = getData("events");
    let eventStartTime = eventData.map(event => {
      return event.interval;
    });

    let alertDiv = document.getElementById("event-message");
    if (eventStartTime.includes(i)) {
      alertDiv.innerHTML = `<h1>${
        events[eventStartTime.indexOf(i)].description
      }</h1>`;
      setTimeout(() => {
        alertDiv.innerHTML = "";
      }, 2000);
    }

    if (i === 59) {
      clearInterval(myInt);
      endGame();
    }
  }, 1000);
}

// ---------------draw Chart---------------------//
function drawChart(tag, data) {
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

  let myLineChart = new Chart(tag, {
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
//----------create Stats---------------//
function updateStats() {
  document.getElementById("stats").innerHTML = `
    <div>
    <h4>Current username: ${CURRENTUSER}</h4>
    <h4>Cash Value: ${CASHVALUE}</h4>
    <h4>Securities Value: ${SECURITIESVALUE}</h4>
    <h4>Total Value: ${
      PORTFOLIOVALUES.length > 0
        ? PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1]
        : CASHVALUE
    }</h4>
    <h4>Shares: ${COSTBASIS.length}</h4>
    <h4>Profit/Loss: ${
      PORTFOLIOVALUES.length > 0
        ? PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1] - 1000
        : CASHVALUE - 1000
    }</h4>
    </div>
  `;
}

//----------create BUY/SELL---------------//

//----------create user--------------//
function addUserForm() {
  // create a new div element
  var userForm = document.createElement("div");
  // set atribute
  userForm.setAttribute("id", "user-form");
  // and give it some content
  userForm.innerHTML = `
      <form action="" method="get" class="form-login">
        <div class="form-login">
          <label for="name">Enter your username: </label><br>
          <input type="text" name="username" id="username" required>
        </div>
        <div class="form-login">
          <input type="submit" name="login" value="LOGIN">
          <input type="submit" name="create" value="CREATE">
        </div>
      </form>
  `;
  // add the newly created element and its content into the DOM
  let currentDiv = document.getElementById("buttons");
  document.body.insertBefore(userForm, currentDiv);
}

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

function endGame() {
  console.log(URL + "/" + getData("game"));
  fetch(URL + "/" + getData("game"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      net_value: PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1],
      end_price: CURRENTPRICE,
      id: getData("game")
    })
  });
}

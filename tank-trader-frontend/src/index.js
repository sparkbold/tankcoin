const gamesURL = "http://localhost:3000/games";
const usersURL = "http://localhost:3000/users";

TIMEINTERVAL = 0;
CURRENTPRICE = 0;
CURRENTINDEX = 0;
CASHVALUE = 1000;
SECURITIESVALUE = 0;
COSTBASIS = [];
PORTFOLIOVALUES = [];
PRICES = [];
CURRENTUSER = "";

document.addEventListener("DOMContentLoaded", function() {
  fetchUsers();
  loginForm();
  // addUserForm();
  buttonEventListener();
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
      // debugger;
      console.log(event.target.form);
      let username = document.getElementById("username").value.toLowerCase();
      if (username === "" || username === " " || username.length < 5) {
        alert("Please type correct username: no space or empty");
      } else if (allUsers.includes(username)) {
        CURRENTUSER = username;
        loadGame();
        updateStats();
        console.log("found you!!", CURRENTUSER);
      } else {
        alert("User is not exist! Please create user!");
      }
    }

    if (event.target.name === "create") {
      event.preventDefault();
      console.log(event.target.name);
      let username = document.getElementById("username").value.toLowerCase();
      if (username === "" || username === " " || username.length < 5) {
        alert("Please type correct username: no space or empty");
      } else if (allUsers.includes(username)) {
        alert("Username is already exist. Try again!");
      } else {
        CURRENTUSER = username.toLowerCase();
        loadGame();
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
      <canvas id="tradeChart" width="400" height="200"></canvas>`;
      valueChartContainer.innerHTML = `
      <canvas id="valueChart" width="400" height="200"></canvas>`;

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
      priceIndex.unshift(0);
      PRICES = priceIndex.slice();
      let price = 100;
      priceData = [];
      PORTFOLIOVALUES.push(CASHVALUE);
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
    console.log(newDataSet);

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
      console.log(
        CURRENTPRICE,
        events[eventStartTime.indexOf(i)].description,
        i,
        PRICES[i]
      );
      setTimeout(() => {
        alertDiv.innerHTML = "";
      }, 2000);
    } else {
      console.log(CURRENTPRICE, i, PRICES[i]);
    }

    if (i === 60) {
      clearInterval(myInt);
      postGame();
    }
  }, 1000);
}

// ---------------draw Chart---------------------//
function drawChart(tag, data) {
  let dataset = {
    labels: data.map(el => (el = "")),
    datasets: [
      {
        label: "$",
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
    <div class="mdl-color--teal-300">
    <h4>Net Value: <strong class="mdl-color--pink-300">$${
      PORTFOLIOVALUES.length > 0
        ? PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1].toFixed(2)
        : CASHVALUE.toFixed(2)
    }</strong> | Cash Value: <strong>$${CASHVALUE.toFixed(
    2
  )}</strong> |  Securities Value: <strong>$${SECURITIESVALUE.toFixed(
    2
  )}</strong> </h4>
    <h4> | Shares: ${COSTBASIS.length} | Profit/Loss: $${
    PORTFOLIOVALUES.length > 0
      ? (PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1] - 1000).toFixed(2)
      : (CASHVALUE - 1000).toFixed(2)
  } </h4>
    </div>
  `;
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

function postGame() {
  //Update the content in the data base to include the ending value of your portfolio
  fetch(gamesURL + "/" + getData("game"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      net_value: PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1],
      end_price: CURRENTPRICE,
      id: getData("game")
    })
  }).then(() => endGame());
}

function endGame() {
  //Change the buttons to the reset button and add an
  //event listener that reloads the page when rest is clicked
  console.log("fired");

  showLeaderBoard();
  let buttons = document.getElementById("buttons");

  buttons.innerHTML = `
    <button id="reset-button" name="reset-button">RESET</button>
  `;
  document.getElementById("reset-button").addEventListener("click", () => {
    location.reload(true);
  });

  //Add stats and leaderboard
}

function showLeaderBoard() {
  console.log("fired");

  //show the stats
  //Percent return of the stock
  //Percet return of your portfolio
  //if you are within 5% of the stock you did alright, less than 5% you did poorly, greater than 5% you did well
  console.log(CURRENTINDEX);

  document.getElementById("event-message").innerHTML = `
    <ul>
      <li>TANK's return for the period was ${(CURRENTINDEX - 100).toFixed(
        2
      )}%</li>
      <li>Your return for the period was ${(
        (PORTFOLIOVALUES[PORTFOLIOVALUES.length - 1] - 1000) /
        1000
      ).toFixed(2)}%</li>
    </ul>
  `;

  //Number of transactions
  //get the top 10 games by value
}

//----------Material body---------------//
function loadGame() {
  document.body.innerHTML = `
      <div class="logo-font title-font">Tank Co.</div>
      <div id="stats" class="mdl-card-stats mdl-cell--12-col mdl-shadow--3dp">
      </div>
      <div id="buttons">
        <button class="mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-color-text--white" name="play-button">START</button>
        <button class="mdl-button mdl-button--raised mdl-button--colored mdl-js-button mdl-color-text--white" id="buy-button" name="buy-button" disabled>BUY</button>
        <button class="mdl-button mdl-button--raised mdl-button--colored mdl-js-button mdl-color-text--white" id="buy-all" name="buy-all-button" disabled>BUY MAX</button>
        <button class="mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-color-text--white" id="sell-button" name="sell-button" disabled>SELL</button>
        <button class="mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-color-text--white" id="sell-all" name="sell-all-button" disabled>LIQUIDATE</button>
      </div>
      <div id="event-message"></div>
      <div id="price-chart" class="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--6-col"></div>
      <div id="value-chart" class="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--6-col"></div>
  `;
}
//----------Material Login---------------//
function loginForm() {
  // // create a new div element
  // var userForm = document.createElement("div");
  // // set atribute
  // userForm.setAttribute("id", "user-form");
  // // and give it some content
  document.body.innerHTML = `
    <div class="mdl-layout mdl-js-layout mdl-color--grey-100">
      <main class="mdl-layout__content">
        <div id="space"/>
        <div class="mdl-card mdl-shadow--6dp">
          <div class="mdl-card__title mdl-color--teal mdl-color-text--white relative">
            <h2 class="mdl-card__title-text">Tank Co.</h2>
          </div>
          <div class="mdl-card__supporting-text">
            <form id="user-form" action="#">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" pattern="^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$" id="username" />
                <label class="mdl-textfield__label" for="username">Username</label>
                <span class="mdl-textfield__error">username at least 5 characters and no space!</span>
              </div>
            </form>
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <button name="login" class="mdl-cell mdl-cell--12-col mdl-button mdl-button--raised mdl-color--teal mdl-js-button mdl-color-text--white">Log in</button>
            <button name="create" class="mdl-cell mdl-cell--12-col mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-color-text--white">Sign up</button>
          </div>
        </div>
      </main>
    </div>
  `;
  // add the newly created element and its content into the DOM
  // let currentDiv = document.getElementById("buttons");
  // document.body.insertBefore(userForm, currentDiv);
}
//----------create user--------------//
// function addUserForm() {
//   // create a new div element
//   var userForm = document.createElement("div");
//   // set atribute
//   userForm.setAttribute("id", "user-form");
//   // and give it some content
//   userForm.innerHTML = `
//       <form action="" method="get" class="form-login">
//         <div class="form-login">
//           <label for="name">Enter your username: </label><br>
//           <input type="text" name="username" id="username" required>
//         </div>
//         <div class="form-login">
//           <input type="submit" name="login" value="LOGIN">
//           <input type="submit" name="create" value="CREATE">
//         </div>
//       </form>
//   `;
//   // add the newly created element and its content into the DOM
//   let currentDiv = document.getElementById("buttons");
//   document.body.insertBefore(userForm, currentDiv);
// }

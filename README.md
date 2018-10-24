# mod-3-project-tanktrader

## Deliverble:

- User can login with username OR enter it at the end of the game on leaderboard//
- User can create game and do transaction actions (buy/sell)
- User can see the game leaderboard at the end of the game //

## Game instruction:

- The goal of the game is to amass the highest possible net value
- create user or login
- click start to run the game
- user has $10,000 begining cash balance
- the chart display current market price of a company stock
- user have 2 actions to choose:
  - Buy action will buy 1 stock at current market price (options: 5 stocks/All-in)
  - Sell action will sell 1 stock at current market price (options: 5 stocks/Dump-all)
- The game duration is 1 minute

- Net value = Cash balance + current stocks at the end-game market value

## Game logics:

- stock price is created from a normal distribution with randomly modifier: skewness and kurtosis
- events are random factors that would adjust stock price (based on the story outcome)
- each game created will have a number of events that user need to react to

## Implementation:

### back-end

- generate dataset for a game once created and render as json
- json dataset contain: price indices, events

### front-end

- render action buttons: play/start, buy/sell
- render chart: display data with interval 1s for 60s
- click event on buy/sell button grab current market price:

  - if BUY action:

    - add cost basic (current market price) to CB = []
    - update CV = CB - CB
    - update PV = stock number (length of CB[]) X market price
    - update NET = CV + PV

  - if SELL action:
    - remove number of stock from STOCK = []
    - subtract cost basic of stock value from cash balance CASH =[]
    - add number of stocks x market value to MARKETVALUE = []

- Game end when time is over OR net value is less than or equal 0.
-

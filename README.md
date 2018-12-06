# mod-3-project-tanktrader

## Deliverble:

- User can login/create with username 
- User can create game and do transaction actions (buy/sell) 
- User can see the game leaderboard at the end of the game 
- User can see analytics at the end of the game 

## Game instruction:

- The goal of the game is to amass the highest possible net value by trading stock/security/currency
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

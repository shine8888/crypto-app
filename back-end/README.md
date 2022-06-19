# Crypto News

## Getting started

### Setup the project

1. Clone the repository
   ```sh
   git clone git@github.com:shine8888/crypto_news.git
   ```
2. Go to your console and select your project directory.
3. Go to back-end folder
4. Install the project node package from the project root
   ```sh
   npm install || yarn
   ```

## Tests my main APIs

1.  Register API: POST - `http://localhost:4000/users/register` with body contains: name, email, password
2.  Login API: POST - `http://localhost:4000/users/login` with body contains: email, password
3.  Sending Token: POST - `http://localhost:4000/users/sending-token` with body contains: senderId, recipientId, amount, symbol, coinName
4.  Investment: GET - `http://localhost:4000/investment?userId=${userId}` with params: userId, token in headers as x-access-token
5.  Transactions: GET - `http://localhost:4000/transactions?userId=${userId}` with params: userId, token in headers as x-access-token
6.  List coins: GET - `http://localhost:4000/coins/list` with params: limit
7.  Get coin: GET - `http://localhost:4000/coins/coin/:coinId`
8.  Get coin data in a period: GET - `http://localhost:4000/coins/coin/:coinId/timePeriod/:timePeriod`
9.  Get exchanges: GET - `http://localhost:4000/coins/exchanges`
10. Special API - ADD COIN : POST - `http://localhost:4000/users/add-coin` with body contains:senderId, recipientId, amount, symbol, name (This API only for initialize the amount of token of new user)

## Notes:

1.  In this project I am using CoinRanking API to get the informations of token
2.  There are some feature is not working or using yet because I am not push full the API KEY or it will continue develop in the feauture.
3.  To test my APIs with Postman, you can use my account:
    - Account: kieuquang.9999@gmail.com / Password: Quang12345
    - Account: kieuquang.8888@gmail.com / Password: Quang12345

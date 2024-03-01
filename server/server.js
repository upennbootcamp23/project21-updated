const express = require('express');
const path = require('path');
let {ApolloServer} = require('@apollo/server');
let {ExpressMiddleware} = ('@apollo/server/express4');
const db = require('./config/connection');
let {typeDefins, resolvers} = require('./schemas');
let database = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

let server = new ApolloServer({
  typeDefins,
  resolvers,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let apolloServerStart = async() => {
  await server.start();
}

app.use('/graphql', ExpressMiddleware(server));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  });
}

app.use(routes);

database.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});

apolloServerStart();
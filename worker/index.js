const keys = require('./keys'); //File containing host, port to Redis
const redis = require('redis'); // import a redis cient

const redisClient = redis.createClient({  // Create an instance of client
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000 // Re-conect every 1000 ms aka 1 sec.
});
const sub = redisClient.duplicate();  // Create a dup of client

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert'); // look for insert event.

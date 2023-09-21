const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require('redis');
const constants = require("../utils/consts_backend")


const RedisStore = connectRedis(session);
//Configure redis client
let redisUrl = constants.REDIS
const redisClient = redis.createClient({
  host: redisUrl,
  port: 6379,
});

const getSessionConfg = (isProduction) => {
  const memoryStore = new session.MemoryStore();
  const SESSION_CONF = {
    secret: "this is my super super secret, secret!! shhhh",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    store: new RedisStore({ client: redisClient }),
    maxExpiration: 90000,
    cookie: { secure: false },
  };
  // if (isProduction) {
  //   console.log(
  //     `will set sessionstore to memcache ${redisUrl}`
  //   );
  //   SESSION_CONF.store = new RedisStore({ client: redisClient });
  // }
  if (constants.HTTPS_COOKIES === true) {
    SESSION_CONF.cookie.secure = true; // serve secure cookies, i.e. only over https, only for production
  }
  return SESSION_CONF;
};

const getCacheStore = () => {
  return new RedisStore({ client: redisClient })
};

exports.getSessionConfg = getSessionConfg;
exports.getCacheStore = getCacheStore;

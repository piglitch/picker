// src/utils/redis.ts
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL + '?family=0');
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisClient;

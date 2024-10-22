// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import { dummyData } from "./dummyData/dummy.ts";
import cors from "cors";
import check from "./sendData/check.ts";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send(check());
});

app.get("/api/user-apps/", (req, res) => {
  res.send(dummyData);
});

app.listen(3000);

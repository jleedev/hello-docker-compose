import "dotenv/config";

import { once } from "node:events";

import Koa from "koa";
import logger from "koa-logger";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";

import { createClient } from 'redis';
const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
  },
});
await redis.connect();

const app = new Koa();
const router = new Router();
app.use(logger());
app.use(bodyParser());

router.get("/health", async function(ctx, next) {
  ctx.body = await redis.ping();
});

router.get("/notes", async function(ctx, next) {
  const result = [];
  for await (const id of redis.sScanIterator("notes")) {
    result.push(router.url("note", id));
  }
  ctx.body = { result };
});

router.post("/notes/:id", async function(ctx, next) {
  const { id } = ctx.params;
  const { body } = ctx.request.body;
  if (!body) {
    ctx.body = 'e.g. {"body":"…"}\n';
    ctx.status = 400;
    return;
  }
  console.log({id, body});
  await redis.multi().sAdd("notes", id).set(`notes:${id}`, body).exec();
  ctx.status = 303;
  ctx.redirect(ctx.url);
});

router.get("note", "/notes/:id", async function(ctx, next) {
  const { id } = ctx.params;
  const body = await redis.get(`notes:${id}`);
  if (body === null) {
    ctx.status = 404;
    return;
  }
  ctx.body = { body };
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen({
  port: process.env.PORT ?? 3000,
});
await once(server, "listening");
console.log("ready on %o", server.address());

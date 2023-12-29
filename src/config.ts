import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { contextStore } from "./store";

export const config = new Elysia()
  .use(html())
  .derive(({ request }) => ({
    isHtmxRequest: request.headers.has("hx-request"),
  }))
  .onBeforeHandle((context) => contextStore.enterWith(context));

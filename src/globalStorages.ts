import { AsyncLocalStorage } from "async_hooks";
import { type Helpers } from "./config/helpers";
import { Context } from "elysia";

export const globalContext = new AsyncLocalStorage<Context & Helpers>();

export const globalFormErrors = new AsyncLocalStorage<Record<
  string,
  Array<string> | undefined
> | null>();

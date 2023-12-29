import { Context } from "elysia";
import { AsyncLocalStorage } from "async_hooks";

export const contextStore = new AsyncLocalStorage<Context>();
export const errorsStore = new AsyncLocalStorage<Record<
  string,
  Array<string>
> | null>();

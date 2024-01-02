import { Elysia } from "elysia";
import { globalContext, globalFormErrors } from "../globalStorages";

export const globals = new Elysia().onBeforeHandle((context) => {
  // @ts-ignore
  globalContext.enterWith(context);
  globalFormErrors.enterWith(null);
});

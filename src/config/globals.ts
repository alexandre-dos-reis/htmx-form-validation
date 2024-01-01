import { Elysia } from "elysia";
import { globalContext, globalFormErrors } from "../globalStorages";

export const globals = new Elysia().onBeforeHandle((context) => {
  globalContext.enterWith(context);
  globalFormErrors.enterWith(null);
});

import { Context } from "elysia";
import { AsyncLocalStorage } from "async_hooks";

export const globalContext = new AsyncLocalStorage<
  Context & {
    btnSubmitId: string;
    isHtmxRequest: boolean;
    isFormSubmitted: boolean;
  }
>();
export const globalFormErrors = new AsyncLocalStorage<Record<
  string,
  Array<string>
> | null>();

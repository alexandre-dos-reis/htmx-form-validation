import { Context } from "elysia";
import { AsyncLocalStorage } from "async_hooks";
import { z } from "zod";

export const globalContext = new AsyncLocalStorage<
  Context & {
    isMethodPost: boolean;
    isHxRequest: boolean;
    isHxBoosted: boolean;
    isFormSubmitted: boolean;
    isFormValidationRequest: boolean;
  }
>();

export const globalFormErrors = new AsyncLocalStorage<Record<
  string,
  Array<string> | undefined
> | null>();

export const setGlobalErrors = <TZodSafeParse extends z.SafeParseError<any>>(
  parsedSchema: TZodSafeParse
) => {
  const error = parsedSchema.error.flatten().fieldErrors;
  globalFormErrors.enterWith(error);
  return error;
};

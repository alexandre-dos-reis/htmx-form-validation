import { AsyncLocalStorage } from "async_hooks";
import { type Helpers } from "./config/helpers";
import { Context } from "elysia";

export const globalContext = new AsyncLocalStorage<Context & Helpers>();

export const globalFormErrors = new AsyncLocalStorage<Errors>();

export type FieldError = Array<string> | undefined | null;

export type Errors = Record<string, FieldError>;

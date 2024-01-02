import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

export const helpers = new Elysia().use(html()).derive(({ request }) => {
  const isMethodPost = request.method === "POST";
  const contentType = request.headers.get("Content-Type");
  return {
    isMethodPost,
    isHxRequest: request.headers.has("Hx-Request"),
    isHxBoost: request.headers.has("Hx-Boost"),
    isFormSubmitted:
      (isMethodPost && contentType === "application/x-www-form-urlencoded") ||
      (isMethodPost && contentType === "multipart/form-data"),
    isFormValidationRequest: request.headers.has("App-Form-Validation"),
  };
});

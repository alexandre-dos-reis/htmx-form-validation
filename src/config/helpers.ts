import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

export const helpers = new Elysia().use(html()).derive(({ request }) => {
  const contentType = request.headers.get("Content-Type");
  return {
    btnSubmitId: "btn-submit",
    isHtmxRequest: request.headers.has("hx-request"),
    isFormSubmitted:
      request.method === "POST" &&
      (contentType === "application/x-www-form-urlencoded" ||
        contentType === "multipart/form-data"),
  };
});

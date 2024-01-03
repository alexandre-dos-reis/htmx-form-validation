import { Context, Elysia } from "elysia";
import { HX_CONSTANTS } from "./constants";

const getDerive = ({ request }: Context) => {
  const isMethodPost = request.method === "POST";
  const contentType = request.headers.get("Content-Type");
  const isFormValidationRequest = request.headers.has(
    HX_CONSTANTS["App-Form-Validation"].key
  );
  return {
    isMethodPost,
    isHxRequest: request.headers.has("Hx-Request"),
    isHxBoost: request.headers.has("Hx-Boost"),
    hxTargetId: request.headers.get("Hx-Target"),
    hxTriggerId: request.headers.get("Hx-Trigger"),
    hxTriggerName: request.headers.get("Hx-Trigger-Name"),
    isFormValidationRequest,
    isFormSubmitted:
      !isFormValidationRequest &&
      isMethodPost &&
      (contentType === "multipart/form-data" ||
        contentType === "application/x-www-form-urlencoded"),
  };
};

export const helpers = new Elysia().derive((ctx) => getDerive(ctx));

export type Helpers = ReturnType<typeof getDerive>;

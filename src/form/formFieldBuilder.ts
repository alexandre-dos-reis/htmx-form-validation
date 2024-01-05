import { ATTRIBUTES_CONSTANTS, HX_CONSTANTS } from "../config/constants";
import { FieldError, globalContext, globalFormErrors } from "../globalStorages";
import { HxValidation } from "./interfaces";

interface Args<TValue extends any> extends HxValidation {
  name: string;
  errors?: FieldError;
  value: TValue;
}

export const formFieldBuilder = <TValue extends any>(args: Args<TValue>) => {
  const wrapperId = `${args.name}${ATTRIBUTES_CONSTANTS.form["inputWrapperId"]}`;
  const context = globalContext.getStore();

  return {
    wrapperId,
    errorId: `${args.name}${ATTRIBUTES_CONSTANTS.form["inputErrorId"]}`,
    inputId: `${args.name}${ATTRIBUTES_CONSTANTS.form["inputId"]}`,
    value: (typeof context?.body !== "undefined"
      ? (context?.body as Record<string, string>)?.[args.name]
      : args.value) as TValue,
    errors: args.errors ?? globalFormErrors.getStore()?.[args.name],
    ...(args.hxValidation
      ? {
          inputHtmxTags: {
            "hx-sync": "closest form:abort",
          },
          wrapperHtmxTags: {
            [`hx-${args.hxValidation.method?.toLowerCase() ?? "post"}`]:
              args.hxValidation.url ?? context?.path,
            "hx-select": `#${wrapperId}`,
            // "hx-target": "this",
            "hx-trigger":
              args.hxValidation.triggerOn === "keyup"
                ? "keyup changed delay:1s from:find input"
                : "change from:find input",
            "hx-ext": "morph",
            "hx-swap": "morph:outerHTML",
            "hx-include": `closest form`,
            ...HX_CONSTANTS["App-Form-Validation"].attribute,
          },
        }
      : {}),
  };
};

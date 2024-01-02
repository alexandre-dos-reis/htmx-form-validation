import { isValid } from "zod";
import { CONSTANTS } from "../config/constants";
import { globalFormErrors, globalContext } from "../globalStorages";
import { cn } from "../utils";

interface Props extends JSX.HtmlInputTag {
  name: string;
  label?: string;
  errors?: Array<string>;
  hxValidation?: {
    method?: "put" | "post" | "get" | "delete";
    url?: string;
    triggerOn?: "keyup" | "blur";
  };
}

export const Input = ({ label, hxValidation, name, ...p }: Props) => {
  const wrapperId = `${name}-input-wrapper`;
  const errorId = `${name}-input-error`;
  const inputId = `${name}-input-field`;
  const context = globalContext.getStore();
  const errors = p.errors ?? globalFormErrors.getStore()?.[name];

  const wrapperHtmxTags = hxValidation
    ? {
        [`hx-${hxValidation.method?.toLowerCase() ?? "post"}`]:
          hxValidation.url ?? context?.path,
        "hx-select": `#${wrapperId}`,
        "hx-target": "this",
        "hx-trigger":
          hxValidation.triggerOn === "keyup"
            ? "keyup changed delay:1s from:find input"
            : "change from:find input",
        "hx-ext": "morph",
        "hx-swap": "morph:outerHTML",
        "hx-include": `closest form`,
        "hx-headers": '{"app-form-validation": "true"}',
      }
    : {};

  const inputHtmxTags = hxValidation
    ? {
        "hx-sync": "closest form:abort",
        ...(errors ? { autofocus: true } : {}),
      }
    : {};

  const value =
    !p.value && typeof context?.body !== "undefined"
      ? (context?.body as Record<string, string>)?.[name]
      : p.value;

  return (
    <label
      id={wrapperId}
      class={cn("form-control w-full max-w-xs mb-5")}
      {...wrapperHtmxTags}
    >
      {label ? (
        <div class="label">
          <span class="label-text">{label}</span>
        </div>
      ) : null}
      <input
        id={inputId}
        class={cn(
          "input input-bordered input-primary w-full max-w-xs",
          errors && "input-error"
        )}
        {...p}
        name={name}
        value={value}
        {...inputHtmxTags}
      />
      {errors ? (
        <div id={errorId} class="label">
          <span class="label-text-alt text-error">{errors?.join(" ")}</span>
        </div>
      ) : null}
    </label>
  );
};

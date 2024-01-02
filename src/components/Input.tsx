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
        // updating the submit button: show if form is valid.
        "hx-select-oob": CONSTANTS.submitButtonId,
        "hx-headers": '{"app-form-validation": "true"}',
      }
    : {};

  const inputHtmxTags = hxValidation
    ? {
        "hx-preserve": true,
        "hx-sync": "closest form:abort",
        ...(hxValidation.triggerOn === "keyup" && errors
          ? { autofocus: true }
          : {}),
      }
    : {};

  const value =
    !p.value && typeof context?.body !== "undefined"
      ? (context?.body as Record<string, string>)?.[name]
      : p.value;

  return (
    <div id={wrapperId} class="mb-8" {...wrapperHtmxTags}>
      {label ? (
        <label
          for={inputId}
          class={cn("block text-gray-700 text-sm font-bold mb-2")}
        >
          {label}
        </label>
      ) : null}
      <div
        class={cn(
          "shadow appearance-none border rounded w-full text-gray-700 leading-tight",
          errors && "border-2 border-red-500"
        )}
      >
        <input
          id={inputId}
          class={cn("w-full py-2 px-3")}
          {...p}
          name={name}
          value={value}
          {...inputHtmxTags}
        />
      </div>
      {errors ? (
        <div id={errorId} class={cn("text-red-500 mt-2")}>
          {errors?.join(" ")}
        </div>
      ) : null}
    </div>
  );
};

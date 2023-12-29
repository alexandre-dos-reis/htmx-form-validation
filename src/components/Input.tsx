import { errorsStore, contextStore } from "../store";
import { cn } from "../utils";

interface Props extends JSX.HtmlInputTag {
  name: string;
  label?: string;
  errors?: Array<string>;
  clientValidation?: {
    method?: "put" | "post" | "get" | "delete";
    url?: string;
    triggerOn?: "keyup" | "blur";
  };
}

export const Input = ({ label, clientValidation, name, ...p }: Props) => {
  const wrapperId = `${name}-input-wrapper`;
  const errorId = `${name}-input-error`;
  const inputId = `${name}-input-field`;

  const wrapperHtmxTags = clientValidation
    ? {
        [`hx-${clientValidation.method?.toLowerCase() ?? "post"}`]:
          clientValidation.url ?? contextStore.getStore()?.path,
        "hx-select": `#${wrapperId}`,
        "hx-target": "this",
        "hx-trigger":
          clientValidation.triggerOn === "keyup"
            ? "keyup changed delay:1s from:find input"
            : "change from:find input",
        "hx-swap": "outerHTML",
        "hx-include": `#${inputId}`,
      }
    : {};

  const inputHtmxTags = clientValidation
    ? {
        "hx-preserve": true,
        // ...(validate.triggerOn === "keyup" ? { autofocus: true } : {}),
      }
    : {};

  const errors = p.errors ?? errorsStore.getStore()?.[name];

  const value =
    !p.value && typeof contextStore.getStore()?.body !== "undefined"
      ? (contextStore.getStore()?.body as Record<string, string>)?.[name]
      : "";

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

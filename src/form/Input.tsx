import { cn } from "../utils";
import { formFieldBuilder } from "./formFieldBuilder";
import { BaseFormComponent, HxValidation } from "./interfaces";

interface Props
  extends Omit<JSX.HtmlInputTag, "name">,
    BaseFormComponent,
    HxValidation {}

export const Input = ({
  label,
  hxValidation,
  name,
  value: _value,
  ...p
}: Props) => {
  const {
    value,
    errors,
    inputId,
    errorId,
    wrapperId,
    wrapperHtmxTags,
    inputHtmxTags,
  } = formFieldBuilder({
    name,
    hxValidation,
    value: _value,
  });

  return (
    <label
      id={wrapperId}
      class={cn("form-control w-full max-w-xs", errors ? "mb-3" : "mb-11")}
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

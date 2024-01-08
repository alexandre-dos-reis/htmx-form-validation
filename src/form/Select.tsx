import { cn } from "../utils";
import { formFieldBuilder } from "./formFieldBuilder";
import { BaseFormComponent } from "./interfaces";

export interface SelectProps extends Omit<JSX.HtmlSelectTag, "name" | "multiple">, BaseFormComponent {
  options: Array<{ value: string; label: string }>;
  value?: string;
  defaultOptionLabel?: string;
}

export const Select = ({ label, name, value: _value, options, defaultOptionLabel, ...p }: SelectProps) => {
  const { value, errors, inputId, errorId, wrapperId } = formFieldBuilder({
    name,
    value: _value,
  });

  return (
    <label id={wrapperId} class={cn("form-control w-full max-w-xs", errors ? "mb-3" : "mb-11")}>
      {label ? (
        <div class="label">
          <span class="label-text">{label}</span>
        </div>
      ) : null}
      <select
        id={inputId}
        class={cn("select select-primary w-full max-w-xs", errors && "input-error")}
        {...p}
        name={name}
      >
        <option disabled selected={value ? undefined : "selected"} value={""}>
          {defaultOptionLabel ?? "-Select a choice-"}
        </option>
        {options.map((o) => (
          <option value={o.value} selected={value === o.value ? "selected" : undefined}>
            {o.label}
          </option>
        ))}
      </select>
      {errors ? (
        <div id={errorId} class="label">
          <span class="label-text-alt text-error">{errors?.join(" ")}</span>
        </div>
      ) : null}
    </label>
  );
};

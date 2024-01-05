import { cn } from "../utils";
import { formFieldBuilder } from "./formFieldBuilder";
import { BaseFormComponent } from "./interfaces";

interface Props
  extends Omit<JSX.HtmlInputTag, "name" | "value">,
    BaseFormComponent {
  value?: boolean;
  label?: string;
}

export const Toggle = ({ label, name, value: _value, ...p }: Props) => {
  const { value, errors, inputId, errorId, wrapperId } = formFieldBuilder({
    name,
    value: _value,
  });

  return (
    <div
      id={wrapperId}
      class={cn("form-control w-32", errors ? "mb-3" : "mb-11")}
    >
      <label class="label cursor-pointer">
        <span class="label-text">{label}</span>
        <input
          id={inputId}
          type="checkbox"
          class={cn("toggle toggle-primary")}
          {...p}
          name={name}
          value={value ? "true" : "false"}
          checked={value ? true : undefined}
        />
      </label>
      {errors ? (
        <div id={errorId} class="label">
          <span class="label-text-alt text-error">{errors?.join(" ")}</span>
        </div>
      ) : null}
    </div>
  );
};

import { cn } from "../utils";
import { formFieldBuilder } from "./formFieldBuilder";
import { BaseFormComponent } from "./interfaces";

interface Props extends Omit<JSX.HtmlInputTag, "name">, BaseFormComponent {
  label?: string;
  choices: Array<string>;
}

const colors = [
  "radio-primary",
  "radio-secondary",
  "radio-accent",
  "radio-success",
  "radio-warning",
  "radio-info",
  "radio-error",
];

export const Radio = ({ name, choices, value: _value, ...p }: Props) => {
  const { value, errors, inputId, errorId, wrapperId } = formFieldBuilder({
    name,
    value: _value,
  });

  return (
    <div id={wrapperId} class={cn(errors ? "mb-3" : "mb-11")}>
      {choices.map((choice, i) => (
        <div class="form-control w-32">
          <label class="label cursor-pointer">
            <span class="label-text">{choice}</span>
            <input
              {...p}
              id={inputId}
              type="radio"
              name={name}
              class={cn("radio", colors[i])}
              value={choice}
              checked={choice === value ? true : undefined}
            />
          </label>
        </div>
      ))}
      {errors ? (
        <div id={errorId} class="label">
          <span class="label-text-alt text-error">{errors?.join(" ")}</span>
        </div>
      ) : null}
    </div>
  );
};

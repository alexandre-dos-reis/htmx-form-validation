interface Props extends JSX.HtmlInputTag {
  label?: string;
  errors?: Array<string>;
  validate?: {
    verb: "put" | "post" | "get" | "delete";
    url: string;
    triggerOn?: "keyup" | "blur";
  };
}

export const Input = ({ label, errors, validate, ...p }: Props) => {
  const wrapperId = `${p.name}-input-wrapper`;
  const errorId = `${p.name}-error`;
  const inputId = `${p.name}-input`;

  const divHxTags = validate
    ? {
        [`hx-${validate.verb}`]: validate.url,
        "hx-select": `#${wrapperId}`,
        "hx-target": "this",
        "hx-trigger": "keyup changed delay:1s from:find input",
        "hx-swap": "outerHTML",
        "hx-include": `#${inputId}`,
      }
    : {};

  const inputHxTags = validate
    ? {
        "hx-preserve": true,
        autofocus: "true",
      }
    : {};

  return (
    <div id={wrapperId} class="mb-8" {...divHxTags}>
      {label ? (
        <label for={inputId} class="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...p}
        {...inputHxTags}
      />
      {errors ? (
        <div class="text-red-500" id={errorId}>
          {errors?.join(" ")}
        </div>
      ) : null}
    </div>
  );
};

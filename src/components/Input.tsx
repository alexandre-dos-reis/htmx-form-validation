interface Props extends JSX.HtmlInputTag {
  label?: string;
  errors?: Array<string>;
  validationUrl?: string;
}

export const Input = ({ label, errors, validationUrl, ...p }: Props) => {
  const wrapperId = `${p.name}-input-wrapper`;
  const errorId = `${p.name}-error`;
  const inputId = `${p.name}-input`;

  return (
    <div
      id={wrapperId}
      hx-get={validationUrl}
      hx-select={`#${wrapperId}`}
      hx-target="this"
      hx-trigger="blur from:find input"
      hx-swap="outerHTML"
      hx-include={`#${inputId}`}
      class="mb-8"
    >
      {label ? (
        <label for={inputId} class="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...p}
      />
      {errors ? (
        <div class="text-red-500" id={errorId}>
          {errors?.join(" ")}
        </div>
      ) : null}
    </div>
  );
};

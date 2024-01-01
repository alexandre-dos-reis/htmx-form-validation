import { globalContext } from "../globalStorages";
import { cn } from "../utils";

interface Props extends JSX.HtmlFormTag {
  isValid?: boolean;
}
export const Form = ({ children, isValid, ...otherProps }: Props) => {
  const context = globalContext.getStore();
  return (
    <form
      novalidate
      autocomplete="off"
      method="post"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      {...otherProps}
    >
      {children}
      <button
        type="submit"
        id={context?.btnSubmitId}
        disabled={!isValid}
        class={cn(
          "text-white  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center",
          isValid
            ? "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"
            : "bg-gray-500 cursor-not-allowed"
        )}
      >
        Submit
      </button>
    </form>
  );
};

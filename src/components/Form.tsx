import { CONSTANTS } from "../config/constants";
import { globalContext } from "../globalStorages";
import { cn } from "../utils";

interface Props extends JSX.HtmlFormTag {
  label?: string;
}
export const Form = ({ children, label, ...otherProps }: Props) => {
  return (
    <form
      novalidate
      autocomplete="off"
      method="post"
      class="flex flex-col w-full justify-center items-center"
      {...otherProps}
    >
      {children}
      <button
        type="submit"
        // This will block the user submitting the form if javascript is disabled...
        // disabled={!isValid}
        class={cn("btn btn-outline btn-neutral")}
      >
        {label ?? "Submit"}
      </button>
    </form>
  );
};

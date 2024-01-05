import { cn } from "../utils";

interface Props extends JSX.HtmlFormTag {
  submitBtnlabel?: string;
}
export const Form = ({ children, submitBtnlabel, ...otherProps }: Props) => {
  return (
    <form
      novalidate
      autocomplete="off"
      method="post"
      // changed display to grid
      class={cn("flex flex-col w-full justify-center items-center")}
      {...otherProps}
    >
      {children}
      <button
        type="submit"
        // This will block the user submitting the form if javascript is disabled...
        // disabled={!isValid}
        class={cn("btn btn-outline btn-neutral")}
      >
        {submitBtnlabel ?? "Submit"}
      </button>
    </form>
  );
};

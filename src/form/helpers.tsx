import { z } from "zod";
import { globalContext } from "../globalStorages";
import { ComponentProps } from "../utils";
import { Input } from "../components/Input";
import { Form } from "../components/Form";
import { ATTRIBUTES_CONSTANTS } from "../config/constants";

export const handleForm = async <T extends z.ZodTypeAny>({
  schema,
}: {
  schema: T;
}): Promise<{
  data?: z.infer<T>;
  errors?: Partial<Record<keyof z.infer<T>, string[] | undefined>>;
}> => {
  const context = globalContext.getStore();
  const parsedSchema = await schema.safeParseAsync(context?.body);

  if (parsedSchema.success) {
    return { data: parsedSchema.data, errors: undefined };
  } else {
    return {
      data: undefined,
      // @ts-ignore
      errors: parsedSchema.error.flatten().fieldErrors,
    };
  }
};

export type FormDefinition = Record<
  string,
  { props: Omit<ComponentProps<typeof Input>, "name">; schema: z.ZodTypeAny }
>;

export const getSchemaFromDefinition = <TFormDef extends FormDefinition>(
  form: TFormDef
): z.ZodObject<{ [Key in keyof TFormDef]: TFormDef[Key]["schema"] }> => {
  // @ts-ignore
  return z.object(
    Object.fromEntries(
      new Map(
        Object.keys(form).map(
          (k) =>
            [k, form[k].schema] as [
              keyof TFormDef,
              TFormDef[typeof k]["schema"]
            ]
        )
      )
    )
  );
};

export const renderForm = ({
  form,
  formProps,
}: {
  form: FormDefinition;
  formProps?: ComponentProps<typeof Form>;
}) => {
  return (
    <Form {...formProps}>
      {Object.keys(form).map((k) => (
        <Input name={k} {...form[k].props} />
      ))}
    </Form>
  );
};

export const renderFormInput = <TDef extends FormDefinition>({
  form,
  name,
}: {
  form: TDef;
  name: keyof TDef;
}) => {
  return <Input name={name as string} {...form[name]["props"]} />;
};

export const renderInputFromHxRequest = ({
  form,
}: {
  form: FormDefinition;
}) => {
  const context = globalContext.getStore();

  let name =
    context?.hxTriggerName ||
    context?.hxTargetId?.replace(
      ATTRIBUTES_CONSTANTS.form["inputWrapperId"],
      ""
    );

  if (name && name in form) {
    return renderFormInput({ name, form });
  }

  return <></>;
};

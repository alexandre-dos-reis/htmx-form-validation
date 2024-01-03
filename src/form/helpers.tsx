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

export const getSchemaFromDefinition = (def: FormDefinition) => {
  return z.object(
    Object.fromEntries(
      new Map<keyof typeof def, z.ZodTypeAny>(
        Object.keys(def).map((k) => [k, def[k].schema])
      )
    )
  );
};

export const renderForm = (def: FormDefinition) => {
  return (
    <Form>
      {Object.keys(def).map((k) => (
        <Input name={k} {...def[k].props} />
      ))}
    </Form>
  );
};

export const renderFormInput = <TDef extends FormDefinition>({
  name,
  form,
}: {
  name: string;
  form: TDef;
}) => {
  return <Input name={name as string} {...form[name]["props"]} />;
};

export const renderHxFragmentFromRequest = ({
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

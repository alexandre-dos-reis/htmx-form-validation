import { z } from "zod";
import { globalContext } from "../globalStorages";
import { ComponentProps } from "../utils";
import { Input } from "./Input";
import { Toggle } from "./Toggle";
import { Radio } from "./Radio";
import { Form } from "./Form";
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

type ComponentsPropsMap = {
  input: ComponentProps<typeof Input>;
  toggle: ComponentProps<typeof Toggle>;
  radio: ComponentProps<typeof Radio>;
};

type FormElement<
  TComponentsMap extends ComponentsPropsMap = ComponentsPropsMap,
  TKey extends keyof TComponentsMap = keyof TComponentsMap
> = {
  type: TKey;
  props: Omit<TComponentsMap[TKey], "name">;
  schema: z.ZodTypeAny;
};

export type FormDefinition = Record<string, FormElement>;

export const getSchemaFromDefinition = <TDef extends FormDefinition>(
  form: TDef
): z.ZodObject<{ [Key in keyof TDef]: TDef[Key]["schema"] }> => {
  // @ts-ignore
  return z.object(
    Object.fromEntries(
      new Map(
        Object.keys(form).map(
          (k) => [k, form[k].schema] as [keyof TDef, TDef[typeof k]["schema"]]
        )
      )
    )
  );
};

export const getComponent = <
  TComponentsMap extends ComponentsPropsMap = ComponentsPropsMap,
  TKey extends keyof TComponentsMap = keyof TComponentsMap
>({
  type,
  value,
  name,
  props,
}: {
  type: TKey;
  value: any;
  name: string;
  props: Omit<TComponentsMap[TKey], "name">;
}) => {
  switch (type) {
    case "input":
      return <Input {...props} name={name} value={value} />;
    case "toggle":
      return <Toggle {...props} name={name} value={value} />;
    case "radio":
      return <Radio {...props} name={name} value={value} />;
    default:
      return <></>;
  }
};

export const renderForm = <TDef extends FormDefinition>({
  form,
  formProps,
  defaultValues,
}: {
  form: TDef;
  defaultValues?: { [Key in keyof TDef]: z.infer<TDef[Key]["schema"]> };
  formProps?: ComponentProps<typeof Form>;
}) => {
  return (
    <Form {...formProps}>
      {Object.keys(form).map((name) => {
        const { type, props } = form[name];
        const value = defaultValues?.[name];
        return getComponent({ type, name, props, value });
      })}
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
  const {
    type,
    props: { value, ...otherProps },
  } = form[name];
  return getComponent({ name: name as string, value, type, props: otherProps });
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

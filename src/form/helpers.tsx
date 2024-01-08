import { z } from "zod";
import { globalContext } from "../globalStorages";
import { ComponentProps } from "../utils";
import { Input, InputProps } from "./Input";
import { Toggle, ToggleProps } from "./Toggle";
import { Radio, RadioProps } from "./Radio";
import { Select, SelectProps } from "./Select";
import { Form } from "./Form";
import { ATTRIBUTES_CONSTANTS } from "../config/constants";
import { match } from "ts-pattern";

type OmitName<TProps extends { name: string }> = Omit<TProps, "name">;

type PropsPerType =
  | {
      type?: "input";
      props: OmitName<InputProps>;
    }
  | {
      type: "toggle";
      props: OmitName<ToggleProps>;
    }
  | {
      type: "select";
      props: OmitName<SelectProps>;
    }
  | {
      type: "radio";
      props: OmitName<RadioProps>;
    };

export type FormDefinition = Record<
  string,
  PropsPerType & {
    schema: z.ZodTypeAny;
  }
>;

export const createForm = <TFormDef extends FormDefinition>({ form }: { form: TFormDef }) => {
  const getSchemaFromDefinition = (): z.ZodObject<{
    [Key in keyof TFormDef]: TFormDef[Key]["schema"];
  }> => {
    // @ts-ignore
    return z.object(
      Object.fromEntries(
        new Map(Object.keys(form).map((k) => [k, form[k].schema] as [keyof TFormDef, TFormDef[typeof k]["schema"]])),
      ),
    );
  };

  type Schema = ReturnType<typeof getSchemaFromDefinition>;

  const handleForm = async (): Promise<{
    data?: z.infer<ReturnType<typeof getSchemaFromDefinition>>;
    errors?: Partial<Record<keyof z.infer<Schema>, string[] | undefined>>;
  }> => {
    const context = globalContext.getStore();
    const parsedSchema = await getSchemaFromDefinition().safeParseAsync(context?.body);

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

  const getComponent = ({ propsPerType, name }: { propsPerType: PropsPerType; name: string }) => {
    return match(propsPerType)
      .with({ type: "input" }, ({ props }) => <Input {...props} name={name} />)
      .with({ type: "toggle" }, ({ props }) => <Toggle {...props} name={name} />)
      .with({ type: "radio" }, ({ props }) => <Radio {...props} name={name} />)
      .with({ type: "select" }, ({ props }) => <Select {...props} name={name} />)
      .otherwise(({ props }) => <Input {...props} name={name} />);
  };

  const renderForm = ({
    formProps,
    defaultValues,
  }: {
    defaultValues?: {
      [Key in keyof TFormDef]: z.infer<TFormDef[Key]["schema"]>;
    };
    formProps?: ComponentProps<typeof Form>;
  }) => {
    return (
      <Form {...formProps}>
        {Object.keys(form).map((name) => {
          const { type, props } = form[name];
          return getComponent({
            name,
            propsPerType: {
              type: type as any,
              props: { ...props, value: defaultValues?.[name] },
            },
          });
        })}
      </Form>
    );
  };

  const renderFormInput = ({ name }: { name: keyof TFormDef }) => {
    const { type, props } = form[name];
    return getComponent({
      name: name as string,
      propsPerType: {
        props: props as any,
        type: type as any,
      },
    });
  };

  const renderInputFromHxRequest = () => {
    const context = globalContext.getStore();

    let name = context?.hxTriggerName || context?.hxTargetId?.replace(ATTRIBUTES_CONSTANTS.form["inputWrapperId"], "");

    if (name && name in form) {
      return renderFormInput({ name });
    }

    return <></>;
  };

  return { handleForm, renderForm, renderInputFromHxRequest };
};

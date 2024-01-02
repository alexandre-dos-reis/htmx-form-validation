import { z } from "zod";

export const handleForm = async <T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): Promise<{
  data?: z.infer<T>;
  errors?: Partial<Record<keyof z.infer<T>, string[] | undefined>>;
}> => {
  const parsedSchema = await schema.safeParseAsync(body);

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

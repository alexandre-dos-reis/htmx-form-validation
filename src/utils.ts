import { z } from "zod";

export const isObjectSet = (obj: Object) => {
  return Object.keys(obj).length !== 0 || obj.constructor !== Object;
};

export type FormError<TSchema extends z.ZodTypeAny> = Partial<
  Record<keyof z.infer<TSchema>, Array<string> | undefined>
> | null;

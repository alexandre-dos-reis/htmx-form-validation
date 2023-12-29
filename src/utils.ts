import { z } from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isObjectSet = (obj: Object) => {
  return Object.keys(obj).length !== 0 || obj.constructor !== Object;
};

export type FormError<TSchema extends z.ZodTypeAny> = Partial<
  Record<keyof z.infer<TSchema>, Array<string> | undefined>
> | null;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

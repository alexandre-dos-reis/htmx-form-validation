import { globalContext } from "../globalStorages";

export const redirectTo = (args: {
  href: string;
  set: {
    headers: Record<string, string> & {
      "Set-Cookie"?: string | string[];
    };
    status?: number | string;
    redirect?: string;
  };
}) => {
  const context = globalContext.getStore();

  if (context && context.isHxRequest) {
    args.set.headers["HX-Location"] = args.href;
  } else {
    args.set.redirect = args.href;
  }
};

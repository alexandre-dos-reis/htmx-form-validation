import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { z } from "zod";
import { Input } from "./components/Input";
import { FormError, isObjectSet } from "./utils";
import { BaseHtml } from "./components/BaseHtml";

const app = new Elysia()
  .use(html())
  .all("/", async ({ body, path, set, request }) => {
    const schema = z.object({
      name: z.string().min(3),
      age: z.preprocess(
        (val) => parseInt(val as string, 10),
        z.number().min(18, "You must be above 18 !")
      ),
      email: z
        .string()
        .email()
        .refine(async (email) => (email === "john@doe.com" ? false : true), {
          message: "Email is already taken",
        }),
    });
    console.log({ DATA: body });

    let errors: FormError<typeof schema> = null;

    if (request.method === "POST" && isObjectSet(body)) {
      const parsedSchema = await schema.safeParseAsync(body);

      if (!parsedSchema.success) {
        errors = parsedSchema.error.flatten().fieldErrors;
      } else {
        if (!request.headers.has("hx-request")) {
          set.redirect = "/form-completed";
          return;
        }
      }
    }

    // http://hernantz.github.io/inline-form-validation-with-django-and-htmx.html
    return (
      <BaseHtml>
        <h1 class="text-center">HTMX form</h1>
        <form
          novalidate
          method="post"
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <Input
            label="Email"
            name="email"
            type="email"
            value={body?.email ?? ""}
            errors={errors?.email}
            validate={{
              url: path,
              verb: "post",
            }}
          />
          <Input
            label="Name"
            name="name"
            type="text"
            value={body?.name ?? ""}
            errors={errors?.name}
            validate={{
              url: path,
              verb: "post",
            }}
          />
          <Input
            label="Age"
            name="age"
            type="text"
            value={body?.age ?? ""}
            errors={errors?.age}
            validate={{
              url: path,
              verb: "post",
            }}
          />
          <input
            type="submit"
            value="Submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          />
        </form>
      </BaseHtml>
    );
  })
  .get("/form-completed", () => {
    return (
      <BaseHtml>
        <h1>FORM COMPLETED !</h1>
      </BaseHtml>
    );
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

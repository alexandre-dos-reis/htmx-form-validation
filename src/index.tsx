import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { z } from "zod";
import { Input } from "./components/Input";
import { FormError, isObjectSet } from "./utils";
import { BaseHtml } from "./components/BaseHtml";

const app = new Elysia()
  .use(html())
  .get("/", ({ query, path, set }) => {
    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    });

    let errors: FormError<typeof schema> = null;

    if (isObjectSet(query)) {
      const parsedSchema = schema.safeParse(query);

      if (!parsedSchema.success) {
        errors = parsedSchema.error.flatten().fieldErrors;
      } else {
        set.redirect = "/form-completed";
      }
    }

    // http://hernantz.github.io/inline-form-validation-with-django-and-htmx.html
    return (
      <BaseHtml class="bg-black">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={query?.email ?? ""}
            errors={errors?.email}
            validationUrl={path}
          />
          <Input
            label="Name"
            name="name"
            type="text"
            value={query?.name ?? ""}
            errors={errors?.name}
            validationUrl={path}
          />
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Submit
          </button>
        </form>
      </BaseHtml>
    );
  })
  .get("/form-completed", () => {
    return (
      <BaseHtml>
        <div>FORM COMPLETED !</div>
      </BaseHtml>
    );
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

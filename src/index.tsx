import { Elysia } from "elysia";
import { z } from "zod";
import { Input } from "./components/Input";
import { BaseHtml } from "./components/BaseHtml";
import { globalFormErrors } from "./globalStorages";
import { Form } from "./components/Form";
import { helpers } from "./config/helpers";
import { globals } from "./config/globals";

const schema = z.object({
  name: z.string().min(3),
  email: z
    .string()
    .min(1)
    .email()
    .refine(async (email) => email !== "john@doe.com", {
      message: "Email is already taken",
    }),
  age: z
    .string()
    .min(1, "Field must contain a value !")
    .transform((v) => parseInt(v, 10)),
});

const app = new Elysia()
  .use(helpers)
  .use(globals)
  .all("/", async ({ body, set, isHtmxRequest, isFormSubmitted }) => {
    let isFormValid = false;

    if (isFormSubmitted) {
      const parsedSchema = await schema.safeParseAsync(body);

      if (parsedSchema.success) {
        isFormValid = true;
        if (!isHtmxRequest) {
          console.log(parsedSchema.data);
          set.redirect = "/form-completed";
          return;
        }
      } else {
        globalFormErrors.enterWith(parsedSchema.error.flatten().fieldErrors);
      }
    }

    return (
      <BaseHtml>
        <h1 class="text-center text-xl">
          <a href="/">HTMX form</a>
        </h1>
        <Form isFormValid={isFormValid}>
          <Input
            label="Email"
            name="email"
            clientValidation={{
              triggerOn: "blur",
            }}
          />
          <Input
            label="Name"
            name="name"
            clientValidation={{
              triggerOn: "keyup",
            }}
          />
          <Input
            label="Age"
            name="age"
            type="number"
            clientValidation={{
              triggerOn: "blur",
            }}
          />
        </Form>
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

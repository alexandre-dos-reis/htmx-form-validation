import { Elysia } from "elysia";
import { z } from "zod";
import { Input } from "./components/Input";
import { BaseHtml } from "./components/BaseHtml";
import { Form } from "./components/Form";
import { helpers } from "./config/helpers";
import { globals } from "./config/globals";
import { globalFormErrors } from "./globalStorages";
import { handleForm } from "./form/helpers";
import { redirectTo } from "./routers";
import { staticPlugin } from "@elysiajs/static";

const schema = z.object({
  name: z.string().min(3),
  email: z
    .string()
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
  .use(staticPlugin({ assets: "public", prefix: "public" }))
  .use(helpers)
  .use(globals)
  .all(
    "/",
    async ({
      body,
      isFormSubmitted,
      isMethodPost,
      isFormValidationRequest,
    }) => {
      if (isMethodPost) {
        const { data, errors } = await handleForm(schema, body);

        if (errors) {
          globalFormErrors.enterWith(errors);
        }

        if (data) {
          if (!isFormValidationRequest && isFormSubmitted) {
            return (
              <BaseHtml>
                <h1 class="text-center">FORM COMPLETED !</h1>
                <div class="flex items-center justify-center">
                  {JSON.stringify(data, null, 4)}
                </div>
              </BaseHtml>
            );
          }
        }
      }

      return (
        <BaseHtml>
          <Form>
            <Input
              label="Email"
              name="email"
              hxValidation={{
                triggerOn: "keyup",
              }}
            />
            <Input
              label="Name"
              name="name"
              hxValidation={{
                triggerOn: "blur",
              }}
            />
            <Input
              label="Age"
              name="age"
              type="number"
              hxValidation={{
                triggerOn: "blur",
              }}
            />
          </Form>
        </BaseHtml>
      );
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

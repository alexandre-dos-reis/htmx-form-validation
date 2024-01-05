import { Elysia } from "elysia";
import { z } from "zod";
import { BaseHtml } from "./components/BaseHtml";
import { helpers } from "./config/helpers";
import { globals } from "./config/globals";
import { globalFormErrors } from "./globalStorages";
import {
  FormDefinition,
  getSchemaFromDefinition,
  handleForm,
  renderForm,
  renderInputFromHxRequest,
} from "./form/helpers";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";

const form = {
  email: {
    type: "input",
    schema: z
      .string()
      .email()
      .max(255)
      .refine(async (email) => email !== "john@doe.com", {
        message: "Email is already taken",
      }),
    props: {
      label: "Email",
      hxValidation: {
        triggerOn: "keyup",
      },
    },
  },
  name: {
    type: "input",
    schema: z.string().min(3).max(255),
    props: {
      label: "Name",
      hxValidation: {
        triggerOn: "blur",
      },
    },
  },
  age: {
    type: "input",
    schema: z
      .string()
      .min(1)
      .max(3)
      .transform((v) => parseInt(v, 10)),
    props: {
      type: "number",
      label: "Age",
      hxValidation: {
        triggerOn: "blur",
      },
    },
  },
  agree: {
    type: "toggle",
    schema: z.coerce.boolean(),
    props: {
      label: "Email",
    },
  },
  radio: {
    type: "radio",
    schema: z.string(),
    props: {
      choices: ["choice 1", "choice 2", "choice 3", "choice 4"],
      label: "Choices",
    },
  },
} satisfies FormDefinition;

const schema = getSchemaFromDefinition(form);

const app = new Elysia()
  .use(html())
  .use(staticPlugin({ assets: "public", prefix: "public" }))
  .use(helpers)
  .use(globals)
  .all(
    "/",
    async ({
      isFormSubmitted,
      isMethodPost,
      isFormValidationRequest,
      body,
    }) => {
      if (isMethodPost) {
        console.log({ body });

        const { data, errors } = await handleForm({
          schema,
        });

        if (errors) {
          globalFormErrors.enterWith(errors);
        }

        if (isFormValidationRequest) {
          return renderInputFromHxRequest({
            form,
          });
        }

        if (isFormSubmitted && data) {
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

      const user = {
        age: 23,
        email: "alex@gmail.com",
        name: "Alex",
        agree: true,
        radio: "choice 2",
      };

      return (
        <BaseHtml>
          {renderForm({
            form,
            defaultValues: user,
          })}
        </BaseHtml>
      );
    }
  )
  .get("/form-completed", () => <BaseHtml>ok</BaseHtml>)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

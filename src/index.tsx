import { Elysia } from "elysia";
import { z } from "zod";
import { BaseHtml } from "./components/BaseHtml";
import { helpers } from "./config/helpers";
import { globals } from "./config/globals";
import { globalFormErrors } from "./globalStorages";
import { FormDefinition, createForm } from "./form/helpers";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";

const { renderForm, handleForm, renderInputFromHxRequest } = createForm({
  form: {
    email: {
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
      schema: z.string().min(3).max(255),
      props: {
        label: "Name",
        hxValidation: {
          triggerOn: "blur",
        },
      },
    },
    age: {
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
    toggle: {
      type: "toggle",
      schema: z.coerce.boolean(),
      props: {
        label: "Toggle",
      },
    },
    radio: {
      type: "radio",
      schema: z.string(),
      props: {
        choices: [
          { children: "Choice 1", value: "choice-1" },
          { children: "Choice 2", value: "choice-2" },
          { children: "Choice 3", value: "choice-3" },
        ],
        label: "Choices",
      },
    },
    select: {
      type: "select",
      schema: z.string().min(1, "Please, select a choice !"),
      props: {
        options: [
          { label: "Choice 1", value: "choice-1" },
          { label: "Choice 2", value: "choice-2" },
          { label: "Choice 3", value: "choice-3" },
        ],
      },
    },
  } satisfies FormDefinition,
});

const app = new Elysia()

  .use(html())
  .use(staticPlugin({ assets: "public", prefix: "public" }))
  .use(helpers)
  .use(globals)
  .all("/", async ({ isFormSubmitted, isMethodPost, isFormValidationRequest, body }) => {
    if (isMethodPost) {
      console.log({ body });

      const { data, errors } = await handleForm();

      if (errors) {
        globalFormErrors.enterWith(errors);
      }

      if (isFormValidationRequest) {
        return renderInputFromHxRequest();
      }

      if (isFormSubmitted && data) {
        return (
          <BaseHtml>
            <h1 class="text-center">FORM COMPLETED !</h1>
            <div class="flex items-center justify-center">{JSON.stringify(data, null, 4)}</div>
          </BaseHtml>
        );
      }
    }

    const defaultValues = {
      age: 23,
      email: "alex@gmail.com",
      name: "Alex",
      toggle: true,
      radio: "choice-3",
      select: "choice-3",
    };

    return (
      <BaseHtml>
        {renderForm({
          defaultValues,
        })}
      </BaseHtml>
    );
  })
  .get("/form-completed", () => <BaseHtml>ok</BaseHtml>)
  .listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import Ajv from "ajv";
import addFormats from "ajv-formats";

interface Props extends JSX.HtmlInputTag {
  label?: string;
  error?: string;
  validate?: {
    triggerOn: "blur";
    schema: z.Schema;
  };
}

const Input = ({ label, error, validate, ...p }: Props) => {
  const errorId = `${p.name}-error`;

  const hxTags = validate
    ? {
        "hx-post": `/api/validation`,
        "hx-trigger": validate.triggerOn,
        "hx-target": `#${errorId}`,
        "hx-vals": `{"rawSchema": ${JSON.stringify(
          zodToJsonSchema(validate.schema, `schema-${p.name}`),
        )}}`,
      }
    : {};

  return (
    <div>
      {label ? <label>{label}</label> : null}
      <input {...p} {...hxTags} />
      <div id={errorId}></div>
    </div>
  );
};

const app = new Elysia()
  .use(html())
  .get("/", () => {
    const nameSchema = z.string().min(3);
    const emailSchema = z.string().email();

    return (
      <html lang="en">
        <head>
          <script
            src="https://unpkg.com/htmx.org@1.9.6"
            integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
            crossorigin="anonymous"
          ></script>
          <title>Input validation</title>
        </head>
        <body>
          <main>
            <form>
              <Input
                name="name"
                type="text"
                validate={{ triggerOn: "blur", schema: nameSchema }}
              />
              <Input
                name="email"
                type="email"
                validate={{ triggerOn: "blur", schema: emailSchema }}
              />
              <button type="submit">Submit</button>
            </form>
          </main>
        </body>
      </html>
    );
  })
  .post("/api/validation", ({ body }) => {
    const key = Object.keys(body).filter((k) => k !== "rawSchema")[0];
    const schema = JSON.parse(body.rawSchema);

    const ajv = new Ajv();
    addFormats(ajv);

    const valid = ajv.validate(schema, body[key]);
    if (!valid) {
      return ajv.errors?.map((e) => e.message).join(" ");
    }
    return "";
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

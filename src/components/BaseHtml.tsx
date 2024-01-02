import { globalContext } from "../globalStorages";
import { cn } from "../utils";
import { Footer } from "./Footer";
import { NavBar } from "./Navbar";

const Body = ({ children, class: className, ...p }: JSX.HtmlBodyTag) => (
  <body
    hx-boost="true"
    class={cn("min-h-screen flex flex-col", className)}
    {...p}
  >
    <NavBar />
    {children}
    <Footer />
  </body>
);

export const BaseHtml = ({ children, ...p }: JSX.HtmlBodyTag) => {
  const context = globalContext.getStore();

  return context?.isHxRequest ? (
    <Body {...p}>{children}</Body>
  ) : (
    <html lang="en">
      <head>
        <link href="/public/assets/index.css" rel="stylesheet" />
        {/* HTMX */}
        <script
          src="https://unpkg.com/htmx.org@1.9.6"
          integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/idiomorph/dist/idiomorph-ext.min.js"></script>
        {/* HTMX */}
        <title>Input validation</title>
      </head>
      <Body {...p}>{children}</Body>
    </html>
  );
};

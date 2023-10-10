export const BaseHtml = ({ children, ...p }: JSX.HtmlBodyTag) => {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          src="https://unpkg.com/htmx.org@1.9.6"
          integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
          crossorigin="anonymous"
        ></script>
        <title>Input validation</title>
      </head>
      <body {...p}>{children}</body>
    </html>
  );
};

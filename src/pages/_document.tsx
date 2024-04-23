import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body className="h-screen-full w-screen-full">
        <Main/>
        <NextScript />
      </body>
    </Html>
  );
}

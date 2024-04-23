import React from "react";
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

import type { AppProps } from "next/app";
import {
  DuckDBConnectionProvider,
  DuckDBPlatform,
  DuckDBProvider,
} from "@duckdb/react-duckdb";

import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm";
import duckdb_wasm_coi from "@duckdb/duckdb-wasm/dist/duckdb-coi.wasm";
import "@/styles/globals.css";
// import "@/styles/shell.css";
// import "xterm/css/xterm.css";

// class ExtraURL {
//   //constructor(url: string, meta: string) {}
// }
// global.URL = global.URL || ExtraURL;

export const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker:
      global.window &&
      new URL(
        "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
        import.meta.url
      ).toString(),
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker:
      global.window &&
      new URL(
        "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
        import.meta.url
      ).toString(),
  },
  coi: {
    mainModule: duckdb_wasm_coi,
    mainWorker:
      global.window &&
      new URL(
        "@duckdb/duckdb-wasm/dist/duckdb-browser-coi.worker.js",
        import.meta.url
      ).toString(),
    pthreadWorker:
      global.window &&
      new URL(
        "@duckdb/duckdb-wasm/dist/duckdb-browser-coi.pthread.worker.js",
        import.meta.url
      ).toString(),
  },
};

const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <DuckDBPlatform logger={logger} bundles={DUCKDB_BUNDLES}>
      <DuckDBProvider>
        <DuckDBConnectionProvider>
          <main className={cn("max-w-screen max-h-screen bg-background font-sans antialiased", fontSans.className)}>
          <Component {...pageProps} />
          </main>
        </DuckDBConnectionProvider>
      </DuckDBProvider>
    </DuckDBPlatform>
  );
}

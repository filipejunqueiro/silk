import { execSync } from "child_process";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
  watch,
  globSync,
} from "fs";
import { rolldown } from "rolldown";

const args = process.argv.slice(2);

const cleanup = async () => {
  console.log("Cleaning up build artifacts...");

  const patterns = ["dist", "fxmanifest.lua", "lib/*.d.ts", "lib/*.d.ts.map"];

  patterns.forEach((p) => {
    const matches = globSync(p);

    matches.forEach((m) => {
      if (existsSync(m)) rmSync(m, { recursive: true, force: true });
    });
  });

  console.log("Cleanup completed!\n");
};

const build = async () => {
  const start = Date.now();
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));

  mkdirSync("dist", { recursive: true });

  writeFileSync(
    "fxmanifest.lua",
    `fx_version 'cerulean'
game 'common'
lua54 'yes'
node_version '22'
use_experimental_fxv2_oal 'yes'

name '${pkg.name}'
description '${pkg.description}'
version '${pkg.version}'
author '${pkg.author}'

server_script 'dist/build.js'`,
  );

  const bundle = await rolldown({
    input: "src/index.ts",
    resolve: { extensions: [".ts", ".js"] },
    treeshake: true,
    external: ["surrealdb"],
  });

  await bundle.write({
    dir: "dist",
    entryFileNames: "build.js",
    sourcemap: false,
    minify: true,
  });

  if (args.includes("--types"))
    try {
      execSync("tsc --project ./lib/tsconfig.json", { stdio: "inherit" });
    } catch (e) {
      console.warn("TypeScript failed.");
    }

  console.log(`Build completed in ${Date.now() - start}ms!`);
};

if (args.includes("--cleanup")) await cleanup();
else if (args.includes("--watch")) {
  await build();

  watch("src", { recursive: true }, async (_, filename) => {
    if (filename) await build();
  });
} else await build();

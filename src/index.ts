import { Database } from "@/database";
import { MethodArguments } from "@/types";

const database = await Database.getInstance();

const silk: Record<string, (args: MethodArguments) => Promise<unknown>> = {
  execute: (args) => database.execute(args),
  single: (args) => database.single(args),
  insert: (args) => database.insert(args),
  update: (args) => database.update(args),
};

for (const [key, method] of Object.entries(silk)) {
  global.exports(key, method);
}

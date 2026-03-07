import type { CFXCallback, CFXParameters } from "@/types";
import { Database } from "./database";

const Silk = {} as Record<string, Function>;

const db = await Database.getInstance();

Silk.query = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => db.query(query, parameters, callback, invokingResource, isPromise);

Silk.single = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => db.single(query, parameters, callback, invokingResource, isPromise);

Silk.insert = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => db.insert(query, parameters, callback, invokingResource, isPromise);

Silk.update = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => db.update(query, parameters, callback, invokingResource, isPromise);

for (const key in Silk) {
  const method = Silk[key];

  const async_method = (
    query: string,
    parameters: CFXParameters,
    invokingResource = GetInvokingResource(),
  ) => {
    return new Promise((resolve, reject) => {
      method(
        query,
        parameters,
        (result: unknown, error: string) => {
          if (error) reject(new Error(error));

          resolve(result);
        },
        invokingResource,
        true,
      );
    });
  };

  global.exports(key, method);
  global.exports(`${key}_async`, async_method);
}

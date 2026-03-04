import type { CFXCallback, CFXParameters } from "@/types";

const Silk = {} as Record<string, Function>;

Silk.query = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => {
  // TODO: Impl this
};

Silk.single = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => {
  // TODO: Impl this
};

Silk.insert = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => {
  // TODO: Impl this
};

Silk.update = (
  query: string,
  parameters: CFXParameters,
  callback: CFXCallback,
  invokingResource = GetInvokingResource(),
  isPromise?: boolean,
) => {
  // TODO: Impl this
};

Silk.isReady = () => {
  // TODO: Impl this
};

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

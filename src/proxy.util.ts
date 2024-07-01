import * as v from "voca";

export namespace ProxyUtils {
  const arrowFuncRegex = /^(async)?\ *\([^)]*\)\s*=>/;

  const isArrowFunction = (func: Function) =>
    arrowFuncRegex.test(func?.toString());

  export type Getters<T> = {
    -readonly [Property in keyof T as `get${Capitalize<
      string & Property
    >}`]: () => T[Property];
  };

  export type WithGetters<T> = T & Getters<T>;

  export const scopeMethods = <T extends object>(object: T) =>
    new Proxy(object, {
      get: (target, propertyName) => {
        const propertyValue = target[propertyName as keyof typeof target];

        return propertyValue instanceof Function &&
          !isArrowFunction(propertyValue)
          ? propertyValue.bind(target)
          : propertyValue;
      },
    });

  export const withGetters = <T extends object>(object: T) =>
    new Proxy(object, {
      get: (target, propertyName) => {
        if (propertyName in target) {
          return (<any>target)[propertyName];
        } else if (propertyName.toString().startsWith("get")) {
          const _propertyName = propertyName.toString().replace(/^get/, "");
          return () => (<any>target)[v.camelCase(_propertyName)];
        }
      },
    }) as WithGetters<T>;
}

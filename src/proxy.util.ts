import * as v from "voca";
const arrowFuncRegex = /^(async)?\ *\([^)]*\)\s*=>/;

const isArrowFunction = (func: Function) =>
  arrowFuncRegex.test(func?.toString());

export type Getters<T> = {
  -readonly [Property in keyof T as `get${Capitalize<
    string & Property
  >}`]: () => T[Property];
};

export type WithGetters<T> = T & Getters<T>;

export type GetterFn = <T extends object>(object: T) => WithGetters<T>;

export const bindMethods = <T extends object>(object: T) =>
  new Proxy(object, {
    get: (target, propertyName) => {
      const propertyValue = target[propertyName as keyof typeof target];

      return propertyValue instanceof Function &&
        !isArrowFunction(propertyValue)
        ? propertyValue.bind(target)
        : propertyValue;
    },
  });

export const withGetters: GetterFn = (object) =>
  new Proxy(object, {
    get: (target: any, propertyName) => {
      if (propertyName in target) return target[propertyName];

      const propertyNameString = propertyName.toString();
      if (propertyNameString.startsWith("get"))
        return () =>
          target[v.camelCase(propertyNameString.replace(/^get/, ""))];
    },
  });

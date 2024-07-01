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

export interface GetFirstPropertyFn {
  <T0, T1>(instance0: T0, instance1: T1): T0 & T1;
  <T0, T1, T2>(instance0: T0, instance1: T1, instance2: T2): T0 & T1 & T2;
  <T0, T1, T2, T3>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3
  ): T0 & T1 & T2 & T3;
  <T0, T1, T2, T3, T4>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3,
    instance4: T4
  ): T0 & T1 & T2 & T3 & T4;
  <T0, T1, T2, T3, T4, T5>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3,
    instance4: T4,
    instance5: T5
  ): T0 & T1 & T2 & T3 & T4 & T5;
  <T0, T1, T2, T3, T4, T5, T6>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3,
    instance4: T4,
    instance5: T5,
    instance6: T6
  ): T0 & T1 & T2 & T3 & T4 & T5 & T6;
  <T0, T1, T2, T3, T4, T5, T6, T7>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3,
    instance4: T4,
    instance5: T5,
    instance6: T6,
    instance7: T7
  ): T0 & T1 & T2 & T3 & T4 & T5 & T6 & T7;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3,
    instance4: T4,
    instance5: T5,
    instance6: T6,
    instance7: T7,
    instance8: T8
  ): T0 & T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    instance0: T0,
    instance1: T1,
    instance2: T2,
    instance3: T3,
    instance4: T4,
    instance5: T5,
    instance6: T6,
    instance7: T7,
    instance8: T8,
    instance9: T9
  ): T0 & T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9;
  (...args: any[]): any;
}

export const getFirstProperty: GetFirstPropertyFn = (...args: any[]) => {
  if (args?.length) {
    const finalObject = {};

    (args || [])
      .filter((e, i) => i)
      .map((e) => Object.keys(e))
      .flat()
      .forEach((e) =>
        Object.defineProperty(finalObject, e, {
          get() {
            for (let arg of args) if (e in arg) return arg[e];
          },
          enumerable: true,
        })
      );

    Object.setPrototypeOf(finalObject, args[0]);
    return finalObject;
  } else return null;
};

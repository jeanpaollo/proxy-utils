import { bindMethods, getFirstProperty, withGetters } from "./barrel";

describe("Test of ProxyUtils", () => {
  describe("with 'bindMethods' from Array", () => {
    const arrayInitialValue = [10, 20, 30];
    let array: Array<number>;
    let arrayProxy: typeof array;

    beforeEach(() => {
      array = Array.from(arrayInitialValue);
      arrayProxy = bindMethods(array);
    });

    for (let x = 0; x < arrayInitialValue.length; x++) {
      it(`invoking 'at' method with index '${x}'`, () => {
        const { at } = arrayProxy;
        expect(at(x)).toBe(array[x]);
      });
    }

    it(`invoking 'concat' method with '0'`, () => {
      const value = 0;
      const { concat } = arrayProxy;
      const newArray = concat(value);
      expect(newArray.includes(value)).toBeTruthy();
    });

    it(`invoking 'concat' method with '[100, 200]'`, () => {
      const values = [100, 200];
      const { concat } = arrayProxy;
      const newArray = concat(values);

      expect(values.every((value) => newArray.includes(value))).toBeTruthy();
    });

    it(`invoking 'pop' must return`, () => {
      const { pop } = arrayProxy;

      expect(
        pop() === arrayInitialValue[arrayInitialValue.length - 1]
      ).toBeTruthy();
    });

    it(`invoking 'shift' must return`, () => {
      const { shift } = arrayProxy;

      expect(shift() === arrayInitialValue[0]).toBeTruthy();
    });
  });

  describe("with 'withGetters' from {}", () => {
    const objectInitialValue = { a: 1, b: 2, c: 3 };
    let object: typeof objectInitialValue;
    let objectProxy: ReturnType<typeof withGetters<typeof objectInitialValue>>;

    beforeEach(() => {
      object = { ...objectInitialValue };
      objectProxy = withGetters(object);
    });

    it("invoke all methods from object", () => {
      for (let key of Object.keys(objectInitialValue)) {
        const methodName =
          `get${key.toUpperCase()}` as keyof typeof objectProxy;
        const returnMethod = (<any>objectProxy)[methodName]();

        expect(returnMethod).toEqual(
          objectProxy[key as keyof typeof objectProxy]
        );
      }
    });
  });

  describe(`with 'getFirstProperty'`, () => {
    const firstObject = {
      a: 1,
      b: 2,
      c: 3,
    };

    const secondObject = {
      a: 2,
      c: 4,
    };

    const thirdObject = {
      d: 5,
      e: 6,
    };

    const result = getFirstProperty(thirdObject, secondObject, firstObject);

    it("invoke three objects", () => {
      expect(result.e).toEqual(thirdObject.e);
      expect(result.d).toEqual(thirdObject.d);
      expect(result.c).toEqual(secondObject.c);
      expect(result.b).toEqual(firstObject.b);
      expect(result.a).toEqual(secondObject.a);
    });
  });
});

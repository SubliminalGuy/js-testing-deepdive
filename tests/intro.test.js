import { describe, it, expect } from "vitest";

import { max, fizzBuzz, calculateAverage, factorial } from "../src/intro";

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    const result = max(5, 3);
    expect(result).toBe(5);
  });

  it("should return the second argument if it is greater", () => {
    const result = max(2, 3);
    expect(result).toBe(3);
  });

  it("should return the first argument if argumenst are equal", () => {
    const result = max(3, 3);
    expect(result).toBe(3);
  });
});

describe("fizzbuzz", () => {
  it("should return fizzBuzz if number is divisible by 3 and 5", () => {
    const result = fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return Fizz if number is only divisible by 3", () => {
    const result = fizzBuzz(6);
    expect(result).toBe("Fizz");
  });

  it("should return Buzz if number is only divisible by 5", () => {
    const result = fizzBuzz(10);
    expect(result).toBe("Buzz");
  });

  it("should return argument if number is not divisible by 3 or 5", () => {
    const result = fizzBuzz(7);
    expect(result).toBe("7");
  });
});

describe("calculateAverage", () => {
  it("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it("should calculate the average of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it("should calculate the average of an array with two elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it("should calculate the average of an array with three elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  it("should return 1 if given 0", () => {
    expect(factorial(0)).toBe(1);
  });

  it("should return 1 if given 1", () => {
    expect(factorial(1)).toBe(1);
  });

  it("should return 2 if given 2", () => {
    expect(factorial(2)).toBe(2);
  });

  it("should return 6 if given 3", () => {
    expect(factorial(3)).toBe(6);
  });
});

import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
} from 'vitest';

import {
  getCoupons,
  calculateDiscount,
  validateUserInput,
  isPriceInRange,
  isValidUsername,
  canDrive,
  fetchData,
  Stack,
} from '../src/core';

describe('getCoupons', () => {
  it('should return an array that is not empty', () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThanOrEqual(1);
  });

  it('should return an array with valid coupon codes', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(typeof coupon.code).toBe('string');
    });
  });

  it('should return an array with valid discounts', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle non-string discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it('should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'SAVE30')).toBe(10);
  });
});

describe('validateUserInput', () => {
  it('should return success if given valid input', () => {
    expect(validateUserInput('David', 29)).toMatch(/success/i);
  });

  it('should return erro if name is not a string or too short or too long', () => {
    expect(validateUserInput(23, 29)).toMatch(/invalid/i);
    expect(validateUserInput('Da', 29)).toMatch(/invalid/i);
    expect(validateUserInput('D'.repeat(256), 29)).toMatch(/invalid/i);
  });

  it('should return invalid age if age is not a number or under 18 or over 100', () => {
    expect(validateUserInput('David', '18')).toMatch(/invalid/i);
    expect(validateUserInput('David', 17)).toMatch(/invalid/i);
    expect(validateUserInput('David', 101)).toMatch(/invalid/i);
  });

  it('should return combined error if both arguments are invalid', () => {
    expect(validateUserInput('Da', '18')).toBe('Invalid username, Invalid age');
  });
});

describe('isPriceInRange', () => {
  it.each([
    { price: 40, min: 60, max: 90, result: false },
    { price: 100, min: 60, max: 90, result: false },
    { price: 60, min: 60, max: 90, result: true },
    { price: 90, min: 60, max: 90, result: true },
    { price: 65, min: 60, max: 90, result: true },
  ])(
    'should result $result for $price when min: $min and max: $max',
    ({ price, min, max, result }) => {
      expect(isPriceInRange(price, min, max)).toBe(result);
    },
  );
});

describe('isValidUsername', () => {
  it('should return false when username length is out of range', () => {
    expect(isValidUsername('D'.repeat(16))).toBe(false);
    expect(isValidUsername('Dav')).toBe(false);
  });

  it('should return true when username length is equal to minLength or maxLength', () => {
    expect(isValidUsername('D'.repeat(15))).toBe(true);
    expect(isValidUsername('David')).toBe(true);
  });

  it('should return true when the username length is within range', () => {
    expect(isValidUsername('Donald')).toBe(true);
  });

  it('should return false if argument is invalid input type', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe('canDrive', () => {
  it('should return invalid if countryCode is invalid', () => {
    expect(canDrive(9, 'DE')).toMatch(/invalid/i);
  });

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])('should return $result for $age, $country', ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

describe('fetchData', () => {
  it('should return a promise that will resolve to an array of numbers', async () => {
    try {
      const result = await fetchData();
    } catch (err) {
      expect(err).toHaveProperty('reason');
      expect(err.reason).toMatch(/network/i);
    }
  });
});

describe('test suite', () => {
  beforeAll(() => {
    console.log('called beforeAll');
  });
  beforeEach(() => {
    console.log('called beforeEach');
  });

  it('test case 1', () => {});
  it('test case 2', () => {});
});

describe('Stack', () => {
  let stack;
  beforeAll(() => {
    stack = new Stack();
  });

  beforeEach(() => {
    stack.clear();
  });

  it('initially the items array is empty', () => {
    expect(stack.size()).toEqual(0);
    expect(stack.isEmpty()).toBe(true);
  });

  it('the items array contains 1 element if one is pushed', () => {
    stack.push(6);

    expect(stack.size()).toEqual(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it('the peek method shows the last item that was inserted and maintain its length', () => {
    stack.push(6);
    stack.push(7);
    stack.push(8);

    expect(stack.size()).toEqual(3);
    expect(stack.isEmpty()).toBe(false);
    expect(stack.peek()).toBe(8);
    expect(stack.size()).toEqual(3);
  });

  it('the pop method returns the last item that was inserted and length decreases', () => {
    stack.push(6);
    stack.push(7);
    stack.push(8);

    expect(stack.size()).toEqual(3);
    expect(stack.isEmpty()).toBe(false);
    expect(stack.pop()).toBe(8);
    expect(stack.size()).toEqual(2);
  });

  it('pop should throw an error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('peek should throw an error if stack is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });
});

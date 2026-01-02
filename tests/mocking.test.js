import { vi, it, expect, describe } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
  signUp,
  login,
  isOnline,
  getDiscount,
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe('test suite', () => {
  it('test case', () => {
    const sendMessage = vi.fn();
    sendMessage.mockImplementation(() => 'hello user1');

    const res = sendMessage();

    expect(sendMessage).toHaveBeenCalled();
    expect(res).toBe('hello user1');
  });
});

describe('getPriceInCurrency', () => {
  it(' should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, 'AUD');

    expect(price).toBe(15);
  });
});

describe('getShippingInfo', () => {
  it('should return shipping unavailable', () => {
    vi.mocked(getShippingQuote).mockReturnValue(undefined);

    const info = getShippingInfo('Duisburg');

    expect(info).toMatch(/unavailable/i);
  });

  it('should return correct cost and estimation', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 50, estimatedDays: 2 });

    const info = getShippingInfo('Duisburg');

    expect(info).toMatch('$50');
    expect(info).toMatch(/2 days/i);
  });
});

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const order = { totalAmount: 500 };
  const creditCard = { creditCardNumber: '12341234' };

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it('should return failed when payment fails', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });
});

describe('signUp', () => {
  it('should return false if email is not valid', async () => {
    const result = await signUp('dfffff');

    expect(result).toBe(false);
  });

  it('should return true if email is valid', async () => {
    const result = await signUp('info@nitewalkz.net');

    expect(result).toBe(true);
  });

  it('should send welcome email if email is valid', async () => {
    const email = 'info@nitewalkz.net';
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe('login', () => {
  it('should email the one-time login code', async () => {
    const email = 'david@domain.com';
    const spy = vi.spyOn(security, 'generateCode');

    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if current hour is outside opening hours', async () => {
    vi.setSystemTime('2026-01-02 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2026-01-02 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if current hour is within opening hours', async () => {
    vi.setSystemTime('2026-01-02 08:00');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return .2 if is xmas day', async () => {
    vi.setSystemTime('2025-12-25');
    expect(getDiscount()).toBe(0.2);
  });

  it('should return 0 if its not xmas day', async () => {
    vi.setSystemTime('2026-01-02 08:00');
    expect(getDiscount()).toBe(0);
  });
});

import { lastValueFrom, of } from 'rxjs';
import { WrapperInterceptor } from './wrapper.interceptor';

describe('WrapperInterceptor', () => {
  let interceptor: WrapperInterceptor;

  beforeEach(() => {
    interceptor = new WrapperInterceptor();
  });

  it('should wrapper with data key', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });
    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });

  it('should not wrapper when meta key is present', async () => {
    expect(interceptor).toBeDefined();
    const data = { data: { name: 'test' }, meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(data),
    });
    const result = await lastValueFrom(obs$);
    expect(result).toEqual(data);
  });
});

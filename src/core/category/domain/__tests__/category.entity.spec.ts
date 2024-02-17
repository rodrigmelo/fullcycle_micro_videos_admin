import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.aggregate';

describe('Category Without Validator Unit Tests', () => {
  let validateSpy: any;
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
  });
  test('Should change name', () => {
    const category = new Category({ name: 'Movie' });
    expect(category.name).toBe('Movie');
    category.changeName('New movie');
    expect(category.name).toBe('New movie');
    expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  test('Should change description', () => {
    const category = new Category({
      name: 'Movie',
      description: 'Movie description',
    });
    expect(category.description).toBe('Movie description');
    category.changeDescription('New movie description');
    expect(category.description).toBe('New movie description');
    expect(category.notification.hasErrors()).toBe(false);
  });

  test('Should active a category', () => {
    const category = new Category({
      name: 'Movie',
      is_active: false,
    });
    expect(category.is_active).toBeFalsy();
    category.active();
    expect(category.is_active).toBeTruthy();
    expect(category.notification.hasErrors()).toBe(false);
  });

  test('Should disable a category', () => {
    const category = new Category({
      name: 'Movie',
      is_active: true,
    });
    expect(category.is_active).toBeTruthy();
    category.deactive();
    expect(category.is_active).toBeFalsy();
  });

  describe('constructor', () => {
    test('Should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBeNull();
    });

    test('Should create a category with all values', () => {
      const created_at = new Date();
      const category = new Category({
        name: 'Movie',
        is_active: true,
        description: 'Movie description',
        created_at,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBe(created_at);
      expect(category.description).toBe('Movie description');
    });

    test('Should create a category with name and description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBe('Movie description');
    });
  });

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];

    test.each(arrange)('id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });

  describe('create command', () => {
    test('Should create a category', () => {
      const category = Category.create({ name: 'Movie' });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBeNull();
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test('Should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBe('Movie description');
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test('Should create a category with is_active', () => {
      const category = Category.create({ name: 'Movie', is_active: true });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBeNull();
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });
});

describe('Category Validator', () => {
  describe('create command', () => {
    test('should an invalid category with name property', () => {
      const category = Category.create({ name: 't'.repeat(256) });
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid category using name property', () => {
      const category = Category.create({ name: 'Movie' });
      category.changeName('t'.repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});

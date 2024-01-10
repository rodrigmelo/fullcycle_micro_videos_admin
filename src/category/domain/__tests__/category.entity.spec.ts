import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });
  test("Should change name", () => {
    const category = Category.create({ name: "Movie" });
    expect(category.name).toBe("Movie");
    category.changeName("New movie");
    expect(category.name).toBe("New movie");
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test("Should change description", () => {
    const category = Category.create({
      name: "Movie",
      description: "Movie description",
    });
    expect(category.description).toBe("Movie description");
    category.changeDescription("New movie description");
    expect(category.description).toBe("New movie description");
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test("Should active a category", () => {
    const category = new Category({
      name: "Movie",
      is_active: false,
    });
    expect(category.is_active).toBeFalsy();
    category.active();
    expect(category.is_active).toBeTruthy();
  });

  test("Should disable a category", () => {
    const category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.is_active).toBeTruthy();
    category.deactive();
    expect(category.is_active).toBeFalsy();
  });

  describe("constructor", () => {
    test("Should create a category with default values", () => {
      const category = new Category({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBeNull();
    });

    test("Should create a category with all values", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Movie",
        is_active: true,
        description: "Movie description",
        created_at,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBe(created_at);
      expect(category.description).toBe("Movie description");
    });

    test("Should create a category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBe("Movie description");
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];

    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        name: "Movie",
        category_id: category_id as any,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });

  describe("create command", () => {
    test("Should create a category", () => {
      const category = Category.create({ name: "Movie" });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBeNull();
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("Should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBe("Movie description");
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("Should create a category with is_active", () => {
      const category = Category.create({ name: "Movie", is_active: true });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.description).toBeNull();
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    test("should an invalid category with name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        Category.create({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("Should a invalid category using description property", () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("Should a invalid category using is_active property", () => {
      expect(() =>
        Category.create({ is_active: 5 } as any)
      ).containsErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });
    });
  });

  describe("changeName method", () => {
    it("should a invalid category using name property", () => {
      const category = Category.create({ name: "Movie" });
      expect(() => category.changeName(null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => category.changeName("")).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => category.changeName(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => category.changeName("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
  });

  describe("changeDescription method", () => {
    it("should a invalid category using description property", () => {
      const category = Category.create({ name: "Movie" });
      expect(() => category.changeDescription(5 as any)).containsErrorMessages({
        description: ["description must be a string"],
      });
    });
  });
});

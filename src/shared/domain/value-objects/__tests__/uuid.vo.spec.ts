import { Uuid } from "../uuid.vo";
import { validate as uuidValidate } from "uuid";

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  test("should throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid-uuid");
    }).toThrow("Invalid uuid");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("Should create a valid uuid", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
  test("should accept a valid uuid", () => {
    const mockUuid = "4233df17-8a0a-407d-bdbf-9482cca0ed64";
    const uuid = new Uuid(mockUuid);
    expect(uuid.id).toBe(mockUuid);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});

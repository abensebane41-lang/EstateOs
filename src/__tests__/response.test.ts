import { describe, it, expect } from "vitest";
import { success, failure } from "@/server/actions/response";

describe("success", () => {
  it("returns success response with data", () => {
    const result = success({ id: "1", name: "test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ id: "1", name: "test" });
    }
  });

  it("returns success response with string data", () => {
    const result = success("ok");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("ok");
    }
  });

  it("returns success response with array data", () => {
    const result = success([1, 2, 3]);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(3);
    }
  });
});

describe("failure", () => {
  it("returns failure response with error", () => {
    const result = failure("Something went wrong");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Something went wrong");
      expect(result.errors).toBeUndefined();
    }
  });

  it("returns failure response with validation errors", () => {
    const errors = { email: ["Invalid email"], name: ["Required"] };
    const result = failure("Validation failed", errors);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual(errors);
    }
  });
});

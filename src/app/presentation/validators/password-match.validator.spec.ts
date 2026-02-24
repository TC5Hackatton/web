import { passwordMatchValidator } from "./password-match.validator";
import { FormBuilder, FormGroup } from "@angular/forms";

describe("passwordMatchValidator", () => {
  let fb: FormBuilder;
  let form: FormGroup;

  beforeEach(() => {
    fb = new FormBuilder();
    form = fb.group(
      {
        password: [""],
        confirmPassword: [""]
      },
      { validators: passwordMatchValidator("password", "confirmPassword") }
    );
  });

  it("should return null when both fields are empty", () => {
    form.setValue({ password: "", confirmPassword: "" });
    expect(form.errors).toBeNull();
  });

  it("should return null when only password is filled", () => {
    form.setValue({ password: "abc123", confirmPassword: "" });
    expect(form.errors).toBeNull();
  });

  it("should return null when only confirmPassword is filled", () => {
    form.setValue({ password: "", confirmPassword: "abc123" });
    expect(form.errors).toBeNull();
  });

  it("should return null when passwords match", () => {
    form.setValue({ password: "abc123", confirmPassword: "abc123" });
    expect(form.errors).toBeNull();
  });

  it("should return { passwordMismatch: true } when passwords do not match", () => {
    form.setValue({ password: "abc123", confirmPassword: "different" });
    expect(form.errors).toEqual({ passwordMismatch: true });
  });
});

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator = (
  passwordKey: string,
  confirmPasswordKey: string
): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const passwordControl = form.get(passwordKey);
    const confirmPasswordControl = form.get(confirmPasswordKey);

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (!password || !confirmPassword) return null;

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({
        ...confirmPasswordControl.errors,
        passwordMismatch: true
      });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPasswordControl.errors;
      if (errors) {
        delete errors["passwordMismatch"];
        confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  };
};

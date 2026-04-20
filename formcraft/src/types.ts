/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormError {
  message: string;
}

export type FormErrors<T> = {
  [K in keyof T]?: FormError;
};

export interface LoginFormData {
  username: string;
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  confirmPassword: string;
  avatar?: string;
}

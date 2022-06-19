import { object, string, ref } from 'yup';

export const registerUserSchema = object({
  body: object({
    name: string().required('Name is required'),
    password: string()
      .required('Password is required')
      .min(6, 'Password is too short, at least 6 characters')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password only have latin letters'),
    passwordConfirmation: string().oneOf(
      [ref('password'), null],
      'Passwordconfirmation should match password',
    ),
    email: string()
      .required('Email is required')
      .email('Email should be valid'),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string()
      .required('Email is required')
      .email('Email should be valid'),
    password: string()
      .required('Password is required')
      .min(6, 'Password is too short, at least 6 characters')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password only have latin letters'),
  }),
});

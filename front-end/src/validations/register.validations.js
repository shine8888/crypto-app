import * as Yup from 'yup';

export const validationRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .test(
      'len',
      'The userName must be between 3 and 20 characters.',
      (val) =>
        val && val.toString().length >= 3 && val.toString().length <= 20,
    )
    .required('This field is required!'),
  email: Yup.string()
    .email('This is not a valid email.')
    .required('This field is required!'),
  password: Yup.string()
    .test(
      'len',
      'The password must be between 6 and 40 characters.',
      (val) =>
        val && val.toString().length >= 6 && val.toString().length <= 40,
    )
    .required('This field is required!'),
});

export const validationLoginSchema = Yup.object().shape({
  email: Yup.string().required('Email field is required!'),
  password: Yup.string().required('Password field is required!'),
});
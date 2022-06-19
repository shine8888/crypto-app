import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { register } from '../../slices/auth.slice';
import { clearMessage } from '../../slices/message.slice';
import { validationRegisterSchema } from '../../validations/register.validations';
import { message as antdMessage } from 'antd';

const Register = () => {
  const history = useHistory()
  const dispatch = useDispatch();

  // USESTATE
  const [successful, setSuccessful] = useState(false);
  // USESELECTOR
  const message = useSelector((state) => state?.message);

  // USEEFFECT
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (successful) {
      antdMessage.success('Your register is successful');
      setTimeout(() => history.push('/login'), 1000)
    }
  }, [successful])

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const handleRegister = (formValue) => {
    const { name, email, password } = formValue;
    setSuccessful(false);
    dispatch(register({ name, email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  return (
    <div class='container'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationRegisterSchema}
        onSubmit={handleRegister}
      >
        <Form name='form1 register-form' class='box' autocomplete='off'>
          <h4 className='register--header'>Register</h4>
          {message?.message && (
            <div className='form-group'>
              <div className='alert alert-danger' role='alert'>
                {message?.message}
              </div>
            </div>
          )}

          {!successful && (
            <>
              <p className='error-message'>
                <ErrorMessage
                  name='name'
                  component='div'
                  className='alert alert-danger'
                />
              </p>
              <Field
                name='name'
                placeholder='Name'
                type='text'
                autocomplete='off'
              />

              <p className='error-message'>
                <ErrorMessage name='email' className='alert alert-danger' />
              </p>
              <Field
                name='email'
                placeholder='Email'
                type='text'
                autocomplete='off'
              />
              <p className='error-message'>
                <ErrorMessage name='password' className='alert alert-danger' />
              </p>
              <i class='typcn typcn-eye' id='eye'></i>
              <Field
                name='password'
                type='password'
                placeholder='Passsword'
                autocomplete='off'
              />

              <button type='submit' className='btn1 btn-register'>
                Sign Up
              </button>
            </>
          )}
        </Form>
      </Formik>
    </div>
  );
};

export default Register;

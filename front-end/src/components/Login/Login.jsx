import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { login } from '../../slices/auth.slice';
import { clearMessage } from '../../slices/message.slice';
import { validationLoginSchema } from '../../validations/register.validations';

import './styles.scss';

const Login = () => {
  const history = useHistory();

  // USESELECTOR
  const isLoggedIn = useSelector((state) => state?.auth.isLoggedIn);
  const message = useSelector((state) => state?.message);

  // USESTATE
  const [loading, setLoading] = useState(false);

  // USEDISPATCH
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (formValue) => {
    const { email, password } = formValue;
    setLoading(true);
    await dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        history.push('/investment');
      })
      .catch(() => {
        setLoading(false);
      });
  };

  if (isLoggedIn) return <Redirect to='/investment' />;

  return (
    <div class='container'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationLoginSchema}
        onSubmit={handleLogin}
      >
        <Form name='form1' class='box' autocomplete='off'>
          {message.message ? (
            <div className='form-group'>
              <div className='alert alert-danger' role='alert'>
                {message.message}
              </div>
            </div>
          ) : (
            <>
              <h4>Welcome to Crypto News</h4>
              <h5>Sign in to your account.</h5>
            </>
          )}
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

          <div className='group-btn'>
            <input type='checkbox' />
            <span class='rmb'>Remember me</span>
            <a href='#' class='forgetpass'>
              Forget Password?
            </a>
            <button type='submit' class='btn1' disabled={loading}>
              {loading && (
                <span className='spinner-border spinner-border-sm'></span>
              )}
              <span>Login</span>
            </button>
          </div>
        </Form>
      </Formik>
      <a href='/register' class='dnthave'>
        Don’t have an account? Sign up
      </a>
    </div>
  );
};
export default Login;

import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './App';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const handleLoginSuccess = (user) => {
    setUser(user)
    console.log('Login success:', user);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: formSchema,
    onSubmit: (values, actions) => {
      fetch('http://127.0.0.1:5555/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          actions.resetForm();
          handleLoginSuccess(data);
          navigate('/home');
        })
        .catch((error) => alert(error));
    },
  });

  return (
    <div>
      <form className='form' onSubmit={formik.handleSubmit}>
        <h1>Login</h1>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          name='username'
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {formik.touched.username && formik.errors.username && (
          <div className='error'>{formik.errors.username}</div>
        )}

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='error'>{formik.errors.password}</div>
        )}

        <input type='submit' value='Login' className='button' />
      </form>
      <Link to='/signup'>Don't have an account?</Link>
    </div>
  );
}

export default Login

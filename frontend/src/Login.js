import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { UserContext } from './App'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [errorMessage, setErrorMessage] = useState('')
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const formSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  })

  const handleLoginSuccess = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user))
    console.log('Login success:', user);
  }

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
        .then((res) => {
          if (!res.ok) {
            throw new Error('Invalid username or password');
          }
          return res.json();
        })
        .then((data) => {
          actions.resetForm();
          handleLoginSuccess(data);
          navigate('/home');
        })
        .catch((error) => {
          setErrorMessage(error.message);
        })
    },
  })

  return (
    <div className="form-container logincon">
      <div className="form-box">
        <form className="form" onSubmit={formik.handleSubmit}>
          <h1 className="form-heading">Login</h1>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              className="form-input"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="form-error">{formik.errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="form-input"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="form-error">{formik.errors.password}</div>
            )}
          </div>

          {errorMessage && <div className="form-error">{errorMessage}</div>}

          <input type="submit" value="Login" className="form-button" />
        </form>
        <div className="form-link">
          <Link to="/signup">Don't have an account?</Link>
        </div>
      </div>
    </div>
  )
}

export default Login;

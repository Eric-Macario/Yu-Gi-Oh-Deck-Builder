import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    name: yup.string(),
    username: yup.string(),
    password: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
    },
    onSubmit: (values, actions) => {
      fetch('http://127.0.0.1:5555/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Username already taken');
          }
          return res.json();
        })
        .then((data) => {
          actions.resetForm();
          navigate('/');
          console.log(data)
          fetch('http://127.0.0.1:5555/collections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: data.user_id }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error('Failed to create collection');
              }
              return res.json();
            })
            .then((collectionData) => {
              console.log('Collection created successfully:', collectionData);
            })
            .catch((error) => {
              console.error('Error creating collection:', error.message);
            });
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    },
    
    validationSchema: formSchema,
  });

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="form-box">
          <form className="form" onSubmit={formik.handleSubmit}>
            <h1 className="form-heading">Signup</h1>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                value={formik.values.name}
                onChange={formik.handleChange}
                type="text"
                name="name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                value={formik.values.username}
                onChange={formik.handleChange}
                type="text"
                name="username"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                value={formik.values.password}
                onChange={formik.handleChange}
                type="password"
                name="password"
                className="form-input"
              />
            </div>
            {errorMessage && <div className="form-error">{errorMessage}</div>}
            <input type="submit" value="Signup" className="form-button" />
          </form>
          <div className="form-link">
            <Link to="/">Already have an account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

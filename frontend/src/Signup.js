import React from 'react';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Signup() {
    const navigate = useNavigate()
    
    
    const formSchema = yup.object({
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
        .then((res) => res.json())
        .then((data) => {
          actions.resetForm()
          navigate('/')
          console.log(data)
        })
        .catch((error) => alert(error));
    },
    validationSchema: formSchema,
  });

  return (
    <div>
      <form className="form" onSubmit={formik.handleSubmit}>
        <h1>Signup</h1>
        <label>Name</label>
        <input
          value={formik.values.name}
          onChange={formik.handleChange}
          type="text"
          name="name"
        />
        <br />
        <label>Username</label>
        <input
          value={formik.values.username}
          onChange={formik.handleChange}
          type="text"
          name="username"
        />
        <br />
        <label>Password</label>
        <input
          value={formik.values.password}
          onChange={formik.handleChange}
          type="password"
          name="password"
        />
        <input type="submit" value="Signup" className="button" />
      </form>
      <Link to='/login'>Already have an account?</Link>
    </div>
  );
}

export default Signup

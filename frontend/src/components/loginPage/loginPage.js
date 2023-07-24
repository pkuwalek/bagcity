import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './loginPage.scss';
import { authenticateUser } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import ErrorAlert from '../Alerts/ErrorAlert';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required').min(8, 'Your password should be 8 chars minimum'),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true);
      setError('');
      const basicErrorMessage = 'Something went wrong, please try again later.';
      authenticateUser(values)
        .then(async (response) => {
          setIsSubmitting(false);
          if (!response.ok) {
            setError('Invalid email or password.');
          } else {
            const data = await response.json();
            navigate(-1);
            setUserContext((oldValues) => {
              return { ...oldValues, token: data.token };
            });
          }
        })
        .catch(() => {
          setIsSubmitting(false);
          setError(basicErrorMessage);
        });
    },
  });

  return (
    <>
      {error !== '' ? <ErrorAlert error={error} /> : ''}
      <h2>Login</h2>
      <Container md={{ span: 6, offset: 3 }}>
        <Form onSubmit={formik.handleSubmit}>
          <FloatingLabel label="Email address" className="mb-3">
            <Form.Control id="email" type="email" placeholder="name@example.com" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
          </FloatingLabel>
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control id="password" type="password" placeholder="Password" {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
          </FloatingLabel>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};
export default LoginPage;

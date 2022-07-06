import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './loginPage.scss';
import { authenticateUser } from '../../sources/users';

const LoginPage = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .required('Required')
                .min(8, 'Your password should be 8 chars minimum'),
        }),
        onSubmit: values => {
            alert(authenticateUser(values));
        },
    });
 
    return (
    <>
    <h2>Login</h2>
    <Form onSubmit={formik.handleSubmit}>
        <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
            <Form.Control
            id="email"
            type="email"
            placeholder="name@example.com"
            {...formik.getFieldProps('email')}
            />
        {formik.touched.email && formik.errors.email ? (<div>{formik.errors.email}</div>
        ) : null}
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control
            id="password"
            type="password"
            placeholder="Password"
            {...formik.getFieldProps('password')}
            />
        {formik.touched.password && formik.errors.password ? (<div>{formik.errors.password}</div>
        ) : null}
        </FloatingLabel>
        <Button variant="primary" type="submit">
            Submit
        </Button>
    </Form>
    </>
    )
};
export default LoginPage;
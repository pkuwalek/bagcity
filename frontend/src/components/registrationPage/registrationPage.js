import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './registrationPage.scss';
import { createUser } from '../../sources/users';

const RegistrationPage = () => {

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .required('Required')
                .min(8, 'Password should be 8 chars minimum'),
        }),
        onSubmit: values => {
            alert(createUser(values));
        },
    });
 
    return (
    <>
    <h2>Register</h2>
    <Form onSubmit={formik.handleSubmit}>
        <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
            <Form.Control
            id="name"
            type="text"
            placeholder="Name"
            {...formik.getFieldProps('name')}
            />
        {formik.touched.name && formik.errors.name ? (<div>{formik.errors.name}</div>
        ) : null}
        </FloatingLabel>
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
            Sign up
        </Button>
    </Form>
    </>
    )
};
export default RegistrationPage;
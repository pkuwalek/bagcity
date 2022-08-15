import React, { useState, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './registrationPage.scss';
import { createUser } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const RegistrationPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [userContext, setUserContext] = useContext(UserContext);

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
            setIsSubmitting(true);
            setError('');
            const basicErrorMessage = 'Something went wrong, please try again later.';
            createUser(values).then(async response => {
                setIsSubmitting(false);
                if (!response.ok) {
                    alert("invalid creds");
                    setError('Invalid credentials.');
                } else {
                    alert("hurray");
                    const data = await response.json();
                    setUserContext(oldValues => {
                        return { ...oldValues, token: data.token };
                    })
                }
            }).catch(error => {
                setIsSubmitting(false);
                setError(basicErrorMessage);
            })
        },
    });
 
    return (
    <>
    { error !== '' ? <ErrorAlert error={error} /> : '' }
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
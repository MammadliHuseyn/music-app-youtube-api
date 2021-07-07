import React from 'react';
import './../../sass/layout/login.scss';
import { Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import { GoogleLogin } from 'react-google-login';
import * as Yup from 'yup';
import { IUserRegisterForm } from '../../interfaces/types';
import { useDispatch } from 'react-redux';
import { RegisterUser } from '../../store/user/actions';
import { STORAGE_ACTIONS, userActionsWithStore } from '../../localStorage/User/storage';
import { Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Register = () => {
    const { push } = useHistory();
    const dispatch = useDispatch();
    const responseGoogle = (response: any) => {
        const { ct } = response;
        const newGoogleUser: IUserRegisterForm = {
            email: ct.Mt,
            googleId: ct.KS,
            name: ct.tU,
            surname: ct.pS,
            img: ct.CJ,
            password: 'password',
            username: 'username'
        }
        RegisterUser(newGoogleUser)(dispatch)
            .then(() => push('/'))
            .catch(() => {
                // "Account already exists with this email!"
                Swal.fire({
                    title: 'Account already exists with this email!',
                    icon: 'error',
                    iconColor: '#e97236',
                    confirmButtonColor: '#e97236'
                })
            })
    }

    const initialUser: IUserRegisterForm = React.useMemo(() => {
        return {
            name: '',
            surname: '',
            email: '',
            username: '',
            password: '',
            googleId: '',
            img: ''
        }
    }, [])

    const signUpSchema = Yup.object({
        username: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
        name: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
        surname: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Must be 8 characters or more')
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
    })

    const formik = useFormik({
        initialValues: initialUser,
        validationSchema: signUpSchema,
        onSubmit: validUser => {
            RegisterUser(validUser)(dispatch)
                .then(() => push('/'))
                .catch(() => {
                    Swal.fire({
                        title: 'Account already exists with this email!',
                        icon: 'error',
                        iconColor: '#e97236',
                        confirmButtonColor: '#e97236'
                    })
                })
        },
    });
    const user = React.useMemo(() => {
        return userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
    }, [])
    return !user ? (
        <div className="outer-container">
            <div className="browse-container p-0">
                <h1 className="text-center mt-2">Register</h1>
                <Container className="d-flex justify-content-center align-items-center">
                    <form onSubmit={formik.handleSubmit} id="login-form">
                        <div className="form-element">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                {...formik.getFieldProps('username')} />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="validation-error">{formik.errors.username}</div>
                            ) : null}
                        </div>
                        <div className="form-element">
                            <label htmlFor="name">First name</label>
                            <input
                                id="name"
                                type="text"
                                {...formik.getFieldProps('name')} />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="validation-error">{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div className="form-element">
                            <label htmlFor="surname">Last Name</label>
                            <input
                                id="surname"
                                type="text"
                                {...formik.getFieldProps('surname')} />
                            {formik.touched.surname && formik.errors.surname ? (
                                <div className="validation-error">{formik.errors.surname}</div>
                            ) : null}
                        </div>
                        <div className="form-element">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')} />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="validation-error">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="form-element">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')} />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="validation-error">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="form-submit">
                            <button type="submit">Submit</button>
                        </div>
                        <hr className="bg-white" />
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span>Or just sign up with google: </span>
                            <GoogleLogin
                                clientId="178550185435-edfmhkrtkf1h5qf10k4tm27cbacff7lq.apps.googleusercontent.com"
                                buttonText="Sign up"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                className="w-50" />
                        </div>
                    </form>
                </Container>
            </div>
        </div>
    ) : <Redirect to="/" />;
};
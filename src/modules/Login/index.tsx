import React from 'react';
import './../../sass/layout/login.scss';
import { Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import { GoogleLogin } from 'react-google-login';
import * as Yup from 'yup';
import { IUserLoginForm } from '../../interfaces/types';
import { useDispatch } from 'react-redux';
import { LoginUser } from '../../store/user/actions';
import { STORAGE_ACTIONS, userActionsWithStore } from '../../localStorage/User/storage';
import { Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPlaylist } from '../../store/playlist/actions';

export const Login = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const responseGoogle = (response: any) => {
        const { ct } = response;
        const loginGoogleUser: IUserLoginForm = {
            googleId: ct.KS,
            password: 's',
            username: 'u',
        }
        LoginUser(loginGoogleUser)(dispatch)
            .then(() => getPlaylist()(dispatch))
            .then(() => push('/'))
            .catch(err => {
                Swal.fire({
                    title: err.response.data,
                    icon: 'error',
                    iconColor: '#e97236',
                    confirmButtonColor: '#e97236'
                })
            })
    }

    const initialUser: IUserLoginForm = React.useMemo(() => {
        return {
            username: '',
            password: '',
            googleId: ''
        }
    }, [])

    const signInSchema = Yup.object({
        username: Yup.string()
            .required('Required'),
        password: Yup.string()
            .required('Required'),
    })

    const formik = useFormik({
        initialValues: initialUser,
        validationSchema: signInSchema,
        onSubmit: validUser => {
            LoginUser(validUser)(dispatch)
                .then(() => getPlaylist()(dispatch))
                .then(() => push('/'))
                .catch(err => {
                    Swal.fire({
                        title: err.response.data,
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
                <h1 className="text-center mt-2">Login</h1>
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
                            <button type="submit">Login</button>
                        </div>
                        <hr className="bg-white" />
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span>Or just Login with google: </span>
                            <GoogleLogin
                                clientId="178550185435-edfmhkrtkf1h5qf10k4tm27cbacff7lq.apps.googleusercontent.com"
                                buttonText="Login"
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
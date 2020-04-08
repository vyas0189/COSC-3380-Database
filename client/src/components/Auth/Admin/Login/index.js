import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLoginComponent = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const login = useStoreActions(actions => actions.auth.loginAdmin)
    const err = useStoreState(state => state.auth.loginErr)
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const userLogin = { username, password }
        console.log(userLogin);

        login(userLogin);
        setFormData({ username: '', password: '' })
    };

    return (
        <Fragment>
            <h1 className='large text-primary'>Admin Sign In</h1>
            <p className='lead'>
                <i className='fas fa-user' /> Sign Into Your Account
      </p>
            <form className='form' onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Username'
                        name='username'
                        value={username}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                    />
                </div>
                <input type='submit' className='btn btn-primary' value='Login' />
            </form>
            <p className='my-1'>
                Don't have an account? <Link to='/register'>Sign Up</Link>
            </p>
            {err ? <h1>{err}</h1> : null}
        </Fragment>
    )
}

export default AdminLoginComponent

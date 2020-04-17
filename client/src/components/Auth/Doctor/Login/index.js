import { useStoreActions } from 'easy-peasy';
import React, { Fragment, useState } from 'react';
import './Login.css';
<<<<<<< HEAD

const DoctorLoginComponent = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const login = useStoreActions(actions => actions.auth.loginDoctor)
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
            <header className= "dlm">
                <h1 className='large text-primary'>Doctor Sign In</h1>
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
            </header>
        </Fragment>
    )
=======


const DoctorLoginComponent = () => {

	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});

	const { username, password } = formData;

	const login = useStoreActions(actions => actions.auth.loginDoctor)
	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async e => {
		e.preventDefault();
		const userLogin = { username, password }

		login(userLogin);
		setFormData({ username: '', password: '' })
	};

	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row no-gutter">
					<div className="d-none d-md-flex col-md-4 col-lg-6 bg-doctor-login"></div>
					<div className="col-md-8 col-lg-6">
						<div className="login d-flex align-items-center py-5">
							<div className="container">
								<div className="row">
									<div className="col-md-9 col-lg-8 mx-auto">
										<h3 className="login-heading  mb-4">Log In</h3>
										<form onSubmit={(e) => onSubmit(e)}>
											<div className="form-label-group">
												<input
													type="text"
													id="inputUsername"
													className="form-control"
													placeholder="Username"
													name="username"
													value={username}
													onChange={(e) => onChange(e)}
													required
													autoFocus
												/>
												<label htmlFor="inputUsername">
													Username
												</label>
											</div>

											<div className="form-label-group">
												<input
													type="password"
													id="inputPassword"
													className="form-control"
													placeholder="Password"
													name="password"
													value={password}
													onChange={(e) => onChange(e)}
													minLength="6"
													required
												/>
												<label htmlFor="inputPassword">
													Password
												</label>
											</div>
											<button
												className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
												type="submit"
											>
												Sign in
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
>>>>>>> 45305ece24a05e215cd4c4b42df7b123380dbe42
}

export default DoctorLoginComponent

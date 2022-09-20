import {
	faInfoCircle,
	faCheck,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import axios from './api/axios'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const REGISTER_URL = '/register'

const Register = () => {
	const userRef = useRef<HTMLInputElement | null>(null)
	const errRef = useRef<HTMLParagraphElement | null>(null)

	const [user, setUser] = useState('')
	const [validName, setValidName] = useState(false)
	const [userFocus, setUserFocus] = useState(false)

	const [pwd, setPwd] = useState('')
	const [validPwd, setValidPwd] = useState(false)
	const [pwdFocus, setPwdFocus] = useState(false)

	const [matchPwd, setMatchPwd] = useState('')
	const [validMatch, setValidMatch] = useState(false)
	const [matchFocus, setMatchFocus] = useState(false)

	const [errMsg, setErrMsg] = useState('')
	const [success, setSuccess] = useState(false)

	useEffect(() => {
		userRef?.current?.focus()
	}, [])
	useEffect(() => {
		const result = USER_REGEX.test(user)
		console.log(result)
		console.log(user)
		setValidName(result)
	}, [user])
	useEffect(() => {
		const result = PWD_REGEX.test(pwd)
		console.log(result)
		console.log(pwd)
		setValidPwd(result)
		const match = pwd === matchPwd
		setValidMatch(match)
	}, [pwd, matchPwd])
	useEffect(() => {
		setErrMsg('')
	}, [user, pwd, matchPwd])

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		const v1 = USER_REGEX.test(user)
		const v2 = PWD_REGEX.test(pwd)

		if (!v1 || !v2) {
			setErrMsg('Invalid Entry')
			return
		}
		try {
			const response: any = await axios.post(
				REGISTER_URL,
				JSON.stringify({ user, pwd }),
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			)
			console.log(response.data)
			console.log(response.accessToken)
			console.log(JSON.stringify(response))
			setSuccess(true)
			// clear input fields
		} catch (err: any) {
			if (!err?.response) {
				setErrMsg('No Server Response')
			} else if (err.response?.status === 409) {
				setErrMsg('Username Taken')
			} else {
				setErrMsg('Registration Failed')
			}
			errRef.current?.focus()
		}
	}

	return (
		<>
			{success ? (
				<section>
					<h1>Success!</h1>
					<p>
						<a href='/'>Sign In</a>
					</p>
				</section>
			) : (
				<section>
					<p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live='assertive'
					>
						{errMsg}
					</p>
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label>
							Username:
							<span className={validName ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validName || !user ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
							<input
								type='text'
								ref={userRef}
								autoComplete='off'
								onChange={e => setUser(e.target.value)}
								required
								aria-invalid={validName ? false : true}
								aria-describedby='uidnote'
								onFocus={() => setUserFocus(true)}
								onBlur={() => setUserFocus(false)}
							/>
							<p
								id='uinote'
								className={
									userFocus && user && !validName ? 'instructions' : 'offscreen'
								}
							>
								<FontAwesomeIcon icon={faInfoCircle} />
								4 to 24 characters. <br />
								Must begin with a letter. <br />
								Letters, numbers, underscores, hyphens allowed.
							</p>
						</label>

						<label>
							Password:
							<span className={validPwd ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validPwd || !pwd ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
							<input
								type='password'
								ref={userRef}
								autoComplete='off'
								onChange={e => setPwd(e.target.value)}
								required
								aria-invalid={validPwd ? false : true}
								aria-describedby='pwdnote'
								onFocus={() => setPwdFocus(true)}
								onBlur={() => setPwdFocus(false)}
							/>
							<p
								id='pwdnote'
								className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
							>
								<FontAwesomeIcon icon={faInfoCircle} />
								4 to 24 characters. <br />
								Must include uppercase and lowercase letters, a number and a
								special character. <br />
								Allowed special characters:{' '}
								<span aria-label='exclamation mark'>!</span>
								<span aria-label='at symbol'>@</span>{' '}
								<span arial-label='hashtag'>#</span>
								<span aria-label='dollar sign'>$</span>
								<span aria-label='percent'>%</span>
							</p>
						</label>

						<label>
							Confirm Password:
							<span className={validMatch && matchPwd ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validMatch || !matchPwd ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
							<input
								type='password'
								onChange={e => setMatchPwd(e.target.value)}
								required
								aria-invalid={validMatch ? false : true}
								aria-describedby='confirmnote'
								onFocus={() => setMatchFocus(true)}
								onBlur={() => setMatchFocus(false)}
							/>
							<p
								id='confirmnote'
								className={
									matchFocus && !validMatch ? 'instructions' : 'offscreen'
								}
							>
								<FontAwesomeIcon icon={faInfoCircle} />
								Must match the first password input field.
							</p>
						</label>

						<button
							disabled={!validName || !validPwd || !validMatch ? true : false}
						>
							Sign Up
						</button>
					</form>
					<p>
						Already registered? <br />
						<span className='line'>
							<a href='/'>Sign In</a>
						</span>
					</p>
				</section>
			)}
		</>
	)
}

export default Register

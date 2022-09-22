import {
	faInfoCircle,
	faCheck,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AxiosResponse } from 'axios'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import axios from './api/axios'

const USER_REGEX: RegExp = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PWD_REGEX: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const REGISTER_URL: string = '/register'

const Register: FC = () => {
	const userRef = useRef<HTMLInputElement | null>(null)
	const errRef = useRef<HTMLParagraphElement | null>(null)

	const [user, setUser] = useState<string>('')
	const [validName, setValidName] = useState<boolean>(false)
	const [userFocus, setUserFocus] = useState<boolean>(false)

	const [pwd, setPwd] = useState<string>('')
	const [validPwd, setValidPwd] = useState<boolean>(false)
	const [pwdFocus, setPwdFocus] = useState<boolean>(false)

	const [matchPwd, setMatchPwd] = useState<string>('')
	const [validMatch, setValidMatch] = useState<boolean>(false)
	const [matchFocus, setMatchFocus] = useState<boolean>(false)

	const [errMsg, setErrMsg] = useState<string>('')
	const [success, setSuccess] = useState<boolean>(false)

	useEffect(() => {
		userRef.current?.focus()
	}, [])
	useEffect(() => {
		const result: boolean = USER_REGEX.test(user)
		setValidName(result)
		console.log(result)
		console.log(user)
	}, [user])
	useEffect(() => {
		const result: boolean = PWD_REGEX.test(pwd)
		setValidPwd(result)
		console.log(result)
		console.log(pwd)
		const match: boolean = pwd === matchPwd
		setValidMatch(match)
	}, [pwd, matchPwd])
	useEffect(() => {
		setErrMsg('')
	}, [user, pwd, matchPwd])

	const handleSubmit = async (e: FormEvent<EventTarget>) => {
		e.preventDefault()
		const v1: boolean = USER_REGEX.test(user)
		const v2: boolean = PWD_REGEX.test(pwd)

		if (!v1 || !v2) {
			setErrMsg('Invalid Entry')
			return
		}
		try {
			const response: AxiosResponse = await axios.post(
				REGISTER_URL,
				JSON.stringify({ user, pwd }),
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			)
			console.log(response.data)
			console.log(response)
			setSuccess(true)
		} catch (err: any) {
			console.log(err)

			if (!err?.response.data) {
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
							<h3>
								Username:
								<span className={validName ? 'valid' : 'hide'}>
									<FontAwesomeIcon icon={faCheck} />
								</span>
								<span className={validName || !user ? 'hide' : 'invalid'}>
									<FontAwesomeIcon icon={faTimes} />
								</span>
							</h3>
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
							<h3>
								Password:
								<span className={validPwd ? 'valid' : 'hide'}>
									<FontAwesomeIcon icon={faCheck} />
								</span>
								<span className={validPwd || !pwd ? 'hide' : 'invalid'}>
									<FontAwesomeIcon icon={faTimes} />
								</span>
							</h3>
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
							<h3>
								Confirm Password:
								<span className={validMatch && matchPwd ? 'valid' : 'hide'}>
									<FontAwesomeIcon icon={faCheck} />
								</span>
								<span className={validMatch || !matchPwd ? 'hide' : 'invalid'}>
									<FontAwesomeIcon icon={faTimes} />
								</span>
							</h3>
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

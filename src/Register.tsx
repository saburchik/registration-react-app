import {
	faInfoCircle,
	faCheck,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios, { AxiosResponse } from 'axios'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import axiosAPI from './api/axiosAPI'
import { PWD_REGEX, USER_REGEX } from './regex'
import { Form, Input, Button } from 'antd'

const REGISTER_URL: string = '/registesr'

const Register: FC = () => {
	const [form] = Form.useForm()
	const [loadings, setLoadings] = useState(false)

	const userRef: React.MutableRefObject<HTMLInputElement | null | any> =
		useRef(null)
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
		setLoadings(true)
		const v1: boolean = USER_REGEX.test(user)
		const v2: boolean = PWD_REGEX.test(pwd)

		if (!v1 || !v2) {
			setErrMsg('Invalid Entry')
			return
		}
		try {
			const response: AxiosResponse = await axiosAPI.post(
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
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				if (!err.response?.data) return setErrMsg('No Server Response')
				if (err.response?.status === 409) return setErrMsg('Username Taken')
				errRef.current?.focus()
				return setErrMsg('Registration Failed')
			} else {
				console.log('Unexpected error: ', err)
				return 'An unexpected error occurred'
			}
		}
		//setLoadings(false)
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
					<h1>Registration</h1>
					<Form form={form} onFinish={handleSubmit}>
						<Form.Item>
							<label htmlFor='username'>
								<h3>
									Username:
									<span className={validName ? 'valid' : 'hide'}>
										<FontAwesomeIcon icon={faCheck} />
									</span>
									<span className={validName || !user ? 'hide' : 'invalid'}>
										<FontAwesomeIcon icon={faTimes} />
									</span>
								</h3>
							</label>
							<Input
								id='username'
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
						</Form.Item>

						<Form.Item>
							<label htmlFor='password'>
								<h3>
									Password:
									<span className={validPwd ? 'valid' : 'hide'}>
										<FontAwesomeIcon icon={faCheck} />
									</span>
									<span className={validPwd || !pwd ? 'hide' : 'invalid'}>
										<FontAwesomeIcon icon={faTimes} />
									</span>
								</h3>
							</label>
							<Input.Password
								id='password'
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
						</Form.Item>

						<Form.Item>
							<label htmlFor='confirm'>
								<h3>
									Confirm Password:
									<span className={validMatch && matchPwd ? 'valid' : 'hide'}>
										<FontAwesomeIcon icon={faCheck} />
									</span>
									<span
										className={validMatch || !matchPwd ? 'hide' : 'invalid'}
									>
										<FontAwesomeIcon icon={faTimes} />
									</span>
								</h3>
							</label>
							<Input.Password
								id='confirm'
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
						</Form.Item>

						<Button
							className='signup'
							type='primary'
							loading={loadings}
							disabled={!validName || !validPwd || !validMatch ? true : false}
						>
							Sign Up
						</Button>
					</Form>
					<p className='signin'>
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

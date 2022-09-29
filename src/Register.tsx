import {
	faInfoCircle,
	faCheck,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios, { AxiosResponse } from 'axios'
import React, { FC, FormEvent, useEffect, useRef, useState } from 'react'
import axiosAPI from './api/axiosAPI'
import { PWD_REGEX, USER_REGEX } from './regex'
import { Form, Input, Button, Alert } from 'antd'
import { motion } from 'framer-motion'
import { IInputForwardRef } from './type'

const REGISTER_URL: string = '/register'

const Register: FC = () => {
	const [form] = Form.useForm()
	const [loadings, setLoadings] = useState(false)

	const userRef = useRef<HTMLInputElement | null>(null)
	const errRef = useRef(null)

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
			setLoadings(false)
			setSuccess(true)
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				if (!err.response?.data) {
					setErrMsg('No Server Response')
				} else if (err.response?.status === 409) {
					setErrMsg('Username Taken')
				} else {
					setErrMsg('Registration Failed')
				}
				setLoadings(false)
				errRef.current?.focus()
			} else {
				setLoadings(false)
				console.log('Unexpected error: ', err)
				return 'An unexpected error occurred'
			}
		}
	}

	const InputForwardRef: IInputForwardRef = React.forwardRef<any>(
		(props, forwardedRef) => <Input ref={forwardedRef} {...props} />
	)

	const variants = {
		open: { opacity: 1, y: 0 },
		closed: { opacity: 0, y: '-100%' },
	}

	return (
		<>
			{success ? (
				<section>
					<h1 style={{ color: 'greenyellow' }}>Success!</h1>
					<p style={{ textAlign: 'center' }}>
						<a href='/'>Sign Out</a>
					</p>
				</section>
			) : (
				<section>
					{/* <p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live='assertive'
					>
						{errMsg}
					</p> */}
					<Alert
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live='assertive'
						message='Error'
						description={errMsg}
						type='error'
						showIcon
					/>

					<h1>Registration</h1>
					<Form form={form} onSubmitCapture={handleSubmit}>
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
							<InputForwardRef
								ref={userRef}
								id='username'
								autoComplete='off'
								required
								aria-invalid={validName ? false : true}
								aria-describedby='uidnote'
								onFocus={() => setUserFocus(true)}
								onBlur={() => setUserFocus(false)}
								onChange={(e: any) => setUser(e.target.value)}
							/>
							{/* <Input
								id='username'
								ref={userRef}
								autoComplete='off'
								onChange={e => setUser(e.target.value)}
								required
								aria-invalid={validName ? false : true}
								aria-describedby='uidnote'
								onFocus={() => setUserFocus(true)}
								onBlur={() => setUserFocus(false)}
							/> */}
							<motion.p
								animate={userFocus && user && !validName ? 'open' : 'closed'}
								variants={variants}
								id='uinote'
								className={
									userFocus && user && !validName ? 'instructions' : 'offscreen'
								}
							>
								<FontAwesomeIcon icon={faInfoCircle} />
								4 to 24 characters. <br />
								Must begin with a letter. <br />
								Letters, numbers, underscores, hyphens allowed.
							</motion.p>
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
							<motion.p
								animate={pwdFocus && !validPwd ? 'open' : 'closed'}
								variants={variants}
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
							</motion.p>
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
							<motion.p
								animate={matchFocus && !validMatch ? 'open' : 'closed'}
								variants={variants}
								id='confirmnote'
								className={
									matchFocus && !validMatch ? 'instructions' : 'offscreen'
								}
							>
								<FontAwesomeIcon icon={faInfoCircle} />
								Must match the first password input field.
							</motion.p>
						</Form.Item>

						<Button
							className='signup'
							type='primary'
							loading={loadings}
							disabled={!validName || !validPwd || !validMatch ? true : false}
							htmlType='submit'
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

import { Button, Form, Input, InputRef } from 'antd'
import React, {
	ChangeEvent,
	FC,
	FormEvent,
	useEffect,
	useRef,
	useState,
} from 'react'

const Login: FC = () => {
	const [form] = Form.useForm()

	const userRef = useRef<InputRef>(null)
	const errRef = useRef<HTMLParagraphElement>(null)

	const [user, setUser] = useState<string>('')
	const [pwd, setPwd] = useState<string>('')
	const [errMsg, setErrMsg] = useState<string>('')
	const [success, setSuccess] = useState<boolean>(false)

	useEffect(() => {
		userRef.current?.focus()
	}, [])
	useEffect(() => {
		setErrMsg('')
	}, [user, pwd])

	const handleSubmit = async (e: FormEvent<EventTarget>) => {
		e.preventDefault()
		setUser('')
		setPwd('')
		setSuccess(true)
		console.log('some text')
	}

	return (
		<>
			{success ? (
				<section>
					<h1>You are logged in!</h1>
					<br />
					<p>
						<a href='/'>Go to home</a>
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
					<h1>Sign In</h1>
					<Form form={form} onSubmitCapture={handleSubmit}>
						<Form.Item>
							<label htmlFor='username'>Username:</label>
							<Input
								ref={userRef}
								type='text'
								id='username'
								autoComplete='off'
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setUser(e.target.value)
								}
								value={user}
								required
							/>
						</Form.Item>
						<Form.Item>
							<label htmlFor='password'>Password:</label>
							<Input.Password
								type='password'
								id='password'
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setPwd(e.target.value)
								}
								value={pwd}
								required
							/>
						</Form.Item>
						<Button type='primary' className='signup' htmlType='submit'>
							Sign In
						</Button>
					</Form>
					<p>
						Need an Account?
						<span className='signin__inner'>
							<a href='/'>Sign Up</a>
						</span>
					</p>
				</section>
			)}
		</>
	)
}

export default Login

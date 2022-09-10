import {
	faInfoCircle,
	faCheck,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

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

	return (
		<section>
			<p
				ref={errRef}
				className={errMsg ? 'errmsg' : 'offscreen'}
				aria-live='assertive'
			>
				{errMsg}
			</p>
			<h1>Register</h1>
			<form>
				<label htmlFor='username'>
					Username:
					<span className={validName ? 'valid' : 'hide'}>
						<FontAwesomeIcon icon={faCheck} />
					</span>
					<span className={validName || !user ? 'hide' : 'invalid'}>
						<FontAwesomeIcon icon={faTimes} />
					</span>
					<input
						type='text'
						id='username'
						ref={userRef}
						autoComplete='off'
						onChange={e => setUser(e.target.value)}
						required
						aria-invalid={validName ? 'false' : 'true'}
						aria-describedly='uidnote'
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
				<label htmlFor='password'>
					Password:
					<span className={validPwd ? 'valid' : 'hide'}>
						<FontAwesomeIcon icon={faCheck} />
					</span>
					<span className={validPwd || !pwd ? 'hide' : 'invalid'}>
						<FontAwesomeIcon icon={faTimes} />
					</span>
					<input
						type='password'
						id='password'
						ref={userRef}
						autoComplete='off'
						onChange={e => setPwd(e.target.value)}
						required
						aria-invalid={validPwd ? 'false' : 'true'}
						aria-describedly='pwdnote'
						onFocus={() => setPwdFocus(true)}
						onBlur={() => setPwdFocus(false)}
					/>
					<p
						id='pwdnote'
						className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
					>
						<FontAwesomeIcon icon={faInfoCircle} />
						4 to 24 characters. <br />
						Must include uppercase and lowercase letters, a number and a special
						character. <br />
						Allowed special characters:{' '}
						<span aria-label='exclamation mark'>!</span>
						<span aria-label='at symbol'>@</span>{' '}
						<span arial-label='hashtag'>#</span>
						<span aria-label='dollar sign'>$</span>
						<span aria-label='percent'>%</span>
					</p>
				</label>
			</form>
		</section>
	)
}

export default Register

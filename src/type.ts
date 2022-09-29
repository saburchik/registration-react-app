import { MutableRefObject } from 'react'

export interface IInputForwardRef {
	ref: MutableRefObject<HTMLInputElement | null>
	id: string
	autoComplete: string
	required: boolean
	'aria-invalid': boolean
	'aria-describedby': string
	onFocus: () => void
	onBlur: () => void
	onChange: (e: any) => void
}

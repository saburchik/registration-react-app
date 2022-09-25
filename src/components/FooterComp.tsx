import { FC } from 'react'
import { Footer } from 'antd/lib/layout/layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAtom } from '@fortawesome/free-solid-svg-icons'

const FooterComp: FC = () => {
	return (
		<Footer className='footer'>
			<FontAwesomeIcon icon={faAtom} />
			<p>
				<a href='https://github.com/saburchik' target='_blank' rel='noreferrer'>
					Saburchik
				</a>{' '}
				| 2022
			</p>
		</Footer>
	)
}

export default FooterComp

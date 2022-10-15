import { FC } from 'react'
import { Layout } from 'antd'
import { Content, Footer } from 'antd/lib/layout/layout'
import './App.css'
import Register from './Register'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAtom } from '@fortawesome/free-solid-svg-icons'

const App: FC = () => {
	return (
		<Layout className='layout'>
			<Content className='content'>
				<Register />
			</Content>
			<Footer className='footer'>
				<FontAwesomeIcon icon={faAtom} />
				<p>
					<a
						href='https://github.com/saburchik'
						target='_blank'
						rel='noreferrer'
					>
						Saburchik
					</a>{' '}
					| 2022
				</p>
			</Footer>
		</Layout>
	)
}

export default App

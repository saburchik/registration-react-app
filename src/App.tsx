import { FC } from 'react'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import './App.css'
import FooterComp from './components/FooterComp'
import Register from './Register'

const App: FC = () => {
	return (
		<Layout className='layout'>
			<Content className='content'>
				<Register />
			</Content>
			<FooterComp />
		</Layout>
	)
}

export default App

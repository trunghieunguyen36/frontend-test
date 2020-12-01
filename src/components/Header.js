import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Select } from 'antd'
import DispatchContext from '../context/DispatchContext'

const { Option } = Select

const Header = () => {
  const appDispatch = useContext(DispatchContext)
  const [currentNav, setCurrentNav] = useState('all')
  const [currentSort, setCurrentSort] = useState('createdAt')

  const handleNavClick = (e) => {
    setCurrentNav(e.key)
  }

  const handleSortChange = (value) => {
    setCurrentSort(value)
  }

  useEffect(() => {
    const queryBySortFilter = async () => {
      const queryString = currentNav === 'all' ? `books?sort=${currentSort}` : `books?sort=${currentSort}&type=${currentNav}`
      appDispatch({ type: 'changeFilter', value: { currentSort, currentNav, queryString } })
    }
    queryBySortFilter()
  }, [currentNav, currentSort, appDispatch])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <Select defaultValue='createdAt' style={{ width: 120 }} onChange={handleSortChange}>
          <Option value='createdAt'>Newest</Option>
          <Option value='likeCount'>Popular</Option>
        </Select>
      </div>
      <div>
        <Menu onClick={handleNavClick} selectedKeys={[currentNav]} mode='horizontal'>
          <Menu.Item key='all'>All</Menu.Item>
          <Menu.Item key='business'>Business</Menu.Item>
          <Menu.Item key='technology'>Technology</Menu.Item>
        </Menu>
      </div>
      <Link to='/createBook'>Create Book</Link>
    </div>
  )
}

export default Header

import React, { useContext } from 'react'
import { Row, Col } from 'antd'
import StateContext from '../context/StateContext'
import BookItem from './BookItem'

const Grid = ({ refetchData }) => {
  const { books } = useContext(StateContext)
  return (
    <Row gutter={[16, 24]} style={{ marginTop: '20px' }}>
      {books.map((book) => (
        <Col key={book._id} className='gutter-row' lg={6} md={8} sm={12} xs={12}>
          <BookItem refetchData={refetchData} book={book} />
        </Col>
      ))}
    </Row>
  )
}

export default Grid

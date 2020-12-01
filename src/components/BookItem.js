import React from 'react'
import { Card, notification } from 'antd'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { HeartFilled, MessageFilled } from '@ant-design/icons'

const BookItem = ({ book, refetchData }) => {
  const handleClickLikeButton = async () => {
    const response = await Axios.post(`books/${book._id}`)
    if (response.data.status === 'success') {
      notification['success']({
        message: 'Success',
        description: `You liked ${response.data.data.data.name}`,
      })
    } else {
      notification['error']({
        message: 'Error',
        description: 'Something wrong',
      })
    }
    refetchData()
  }

  return (
    <Card style={{ height: '350px' }}>
      <Link to={`/detail/${book._id}`}>
        <div style={{ height: '250px', marginBottom: '20px' }}>
          <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={book.imageUrl} alt='book' />
        </div>
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link style={{ width: '60%' }} to={`/detail/${book._id}`}>
          <span>{book.name}</span>
        </Link>
        <div>
          <span style={{ marginRight: '5px' }}>
            <MessageFilled />
            {book.comments.length}
          </span>
          <span style={{ marginRight: '5px' }}>
            <HeartFilled onClick={handleClickLikeButton} />
            {book.likeCount}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default BookItem

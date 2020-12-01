import React, { useEffect, useState } from 'react'
import { Avatar, Button, notification } from 'antd'
import { Link } from 'react-router-dom'
import { HeartFilled, MessageFilled, InfoCircleFilled } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import CommentModal from './CommentModal'

const Detail = ({ refetchData }) => {
  const [bookDetail, setBookDetail] = useState()
  const [visible, setVisible] = useState(false)
  const bookId = useParams()

  const handleClickLikeButton = async () => {
    const response = await Axios.post(`books/${bookId.id}`)
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

  const handleClickCommentButton = () => {
    setVisible(true)
  }

  useEffect(() => {
    const getBook = async () => {
      const response = await Axios.get(`books/${bookId.id}`)
      setBookDetail(response.data.data.data)
    }
    getBook()
  }, [bookId.id])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', margin: '0 auto', width: '70%' }}>
        <Link style={{ margin: '10px', fontSize: '12px' }} to='/'>
          Back to Homepage
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
            <Avatar src='https://static.toiimg.com/photo/76729750.cms' />
            <div style={{ margin: '0 16px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold' }}>{bookDetail?.name}</span>
              <span>Hieu Nguyen * Follow * Hire Me</span>
            </div>
          </div>
          <div>
            <Button style={{ marginRight: '20px' }}>Save</Button>
            <Button onClick={handleClickLikeButton}>
              <HeartFilled />
              Like
            </Button>
          </div>
        </div>
        <div>
          <img style={{ width: '100%' }} src={bookDetail?.imageUrl} alt='detail' />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'fixed', top: '30%', right: '0', width: '8em', marginTop: '-2.5em' }}>
        <Avatar src='https://static.toiimg.com/photo/76729750.cms' />
        <Button style={{ margin: '10px' }} onClick={handleClickCommentButton}>
          <MessageFilled />
        </Button>
        <Button>
          <InfoCircleFilled />
        </Button>
      </div>
      <CommentModal visible={visible} setVisible={setVisible} bookId={bookId.id} refetchData={refetchData} />
    </>
  )
}

export default Detail

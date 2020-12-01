import React from 'react'
import { Link } from 'react-router-dom'
import { notification, Input, Form, Select, Button } from 'antd'
import Axios from 'axios'
import io from 'socket.io-client'
const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity', //avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout: 10000, //before connect_error and connect_timeout are emitted.
  transports: ['websocket'],
}

const socket = io(process.env.REACT_APP_BACKEND, connectionOptions)

const { Option } = Select

const CreateBook = () => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    form.validateFields().then(async () => {
      const response = await Axios.post('books', values)
      if (response.data.status === 'success') {
        socket.emit('addNewBook', response.data.data)
        notification['success']({
          message: 'Success',
          description: 'Add book success',
        })
      } else {
        notification['error']({
          message: 'Error',
          description: 'Something wrong',
        })
      }
    })
    form.resetFields()
  }

  return (
    <div style={{ margin: '0 auto', width: '50%' }}>
      <h1>Create a new book</h1>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item label='Name:' name='name' rules={[{ required: true, message: 'Please input name of book!' }]}>
          <Input placeholder='Name of your book' />
        </Form.Item>
        <Form.Item label='Type:' name='type' initialValue='business'>
          <Select>
            <Option value='business'>Business</Option>
            <Option value='technology'>Technology</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Image Link:' name='imageUrl'>
          <Input placeholder='Link of the image from the Internet' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Add new book
          </Button>
          <Button type='secondary' style={{ marginLeft: '10px' }}>
            <Link to='/'>Cancel</Link>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateBook

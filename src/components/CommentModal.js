import React from 'react'
import { notification, Modal, Input, Form } from 'antd'
import Axios from 'axios'

const CommentModal = ({ visible, setVisible, bookId, refetchData }) => {
  const [form] = Form.useForm()

  const handleOkModal = () => {
    form
      .validateFields()
      .then(async (values) => {
        const response = await Axios.post(`books/${bookId}/comment`, values)
        if (response.data.status === 'success') {
          notification['success']({
            message: 'Success',
            description: 'Add comment success',
          })
        } else {
          notification['error']({
            message: 'Error',
            description: 'Something wrong',
          })
        }
        refetchData()
        setVisible(false)
        form.resetFields()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleCancelModal = () => {
    form.resetFields()
    setVisible(false)
  }

  return (
    <Modal title='Add comment' visible={visible} onOk={handleOkModal} onCancel={handleCancelModal}>
      <Form form={form} layout='vertical' onFinish={handleOkModal}>
        <Form.Item label='Name:' name='name' rules={[{ required: true, message: 'Please input your name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Email:'
          name='email'
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Your input is not a valid E-mail!' },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label='Comment:' name='comment' rules={[{ required: true, message: 'Please input your comment!' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CommentModal

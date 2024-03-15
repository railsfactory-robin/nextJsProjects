import React, { useState, useEffect } from 'react';
import { Space, Modal, Typography, Button, Form } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
import { IssueProps } from './IssueList'
import { useParams } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Text } = Typography;

interface IssueModalProps {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  issue: IssueProps | null
}

const CreateIssueModal: React.FC<IssueModalProps> = ({ isModalOpen, handleOk, handleCancel, issue }) => {

  const [form] = Form.useForm()
  const params = useParams<{ projectId: string }>()

  const user = useCurrentUser()

  useEffect(() => {
    if (issue && Object.keys(issue).length !== 0) {
      form.setFieldsValue({ id: issue.id, title: issue.title, description: issue.description })
    }
  }, [issue]);

  const onFinish = async (values: any) => {
    const data = { ...values, reporterId: user?.id }
    if (issue?.id) {
      try {
        await axios.patch(`/api/projects/${params.projectId}/issues/${issue.id}`, data)
          .then((res) => {
            if (res.data)
              toast.success('Issue Updated Successfully!')
          }).catch((e) => {
            toast.error('')
          })
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await axios.post(`/api/projects/${params.projectId}/issues`, data)
          .then((res) => {
            if (res.data)
              toast.success('Issue Created Successfully!')
          }).catch((e) => {
            toast.error('')
          })
      } catch (e) {
        console.log(e)
      }
    }
    handleOk()
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal title="Create Issue"
      open={isModalOpen}
      onCancel={handleCancel}
      className='text-center'
      footer={[
        <Button form="createIssueForm" key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        name="createIssueForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        preserve={false}
        labelCol={{ span: 5 }}
        form={form}
      >
        <div className="flex flex-col space-y-4"></div>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input your issue title!' }]}
          className="flex flex-col space-y-4 mb-0"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input your Issue description!' }]}
        >
          <TextArea rows={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateIssueModal;
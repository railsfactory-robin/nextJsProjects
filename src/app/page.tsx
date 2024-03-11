'use client'
import React, { useEffect, useState } from 'react'
import Stats from "./components/stats";
import { Row, Layout, Col, Button, Typography, Table } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';
import Link from 'next/link'

const { Title } = Typography
const { Content } = Layout

export interface ProjectProps {
  id: number,
  name: string,
  description: string,
}


const columns: TableProps<ProjectProps>['columns'] = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_, project) => {
      return <Link href={`/projects/${project.id}/issues`}>{project.name}</Link>
    }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },


];


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editProject, setEditProject] = useState<ProjectProps | null>(null)
  const [projects, setProjects] = useState<Array<ProjectProps>>([])

  useEffect(() => {
    fetchProjects();
  }, [])

  useEffect(() => {

  }, [])

  const fetchProjects = async () => {
    try {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data)
      } catch (e) {
        console.log(e)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOk = () => {
    fetchProjects();
    setIsModalOpen(false)
    setEditProject(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditProject(null)
  }



  return (
    <Layout>
      <Content className='bg-white' style={{
        padding: 24,
        minHeight: '100%',
      }}>
        <h1>Login page</h1>
      </Content>
    </Layout>
  );
}

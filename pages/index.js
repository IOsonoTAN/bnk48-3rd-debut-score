import 'antd/dist/antd.min.css'
import Head from 'next/head'
import Link from 'next/link'
import { Button, Divider, Row, Col, Table, Tooltip, Tag, Space } from 'antd'
import { ReloadOutlined, FacebookOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import axios from 'axios'

export default function Home() {
  const timezone = 'Asia/Bangkok'
  const [isLoading, setLoading] = useState(false)
  const [ranked, setRanked] = useState([])
  const [totalScore, setTotalScore] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(DateTime.local({ zone: timezone }))

  const getRanked = async () => {
    setLoading(true)
    const { data } = await axios.get('/api/scores')

    setLastUpdated(DateTime.fromISO(data.updatedAt, { zone: timezone }))
    setTotalScore(data.ranked.reduce((current, data) => current += +data.score, totalScore))
    setRanked(data.ranked.map((data, index) => {
      return {
        key: index,
        rank: (index + 1),
        ...data
      }
    }))
    setLoading(false)
  }

  useEffect(() => {
    getRanked()
  }, [])

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      dataIndex: 'rank',
      width: '15%',
      sorter: {
        compare: (a, b) => a.rank - b.rank,
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: ranked.map(record => {
        return {
          text: record.name,
          value: record.name,
        }
      }),
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
      width: '55%',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      align: 'right',
      sorter: {
        compare: (a, b) => a.score - b.score,
      },
      width: '30%',
      render: (score) => {
        return (
          <Tooltip placement="left" title={score} color="blue">
            {Number(score).toLocaleString(undefined, { minimumFractionDigits: 3 })}
          </Tooltip>
        )
      }
    }
  ]

  return (
    <div>
      <Head>
        <title>Debut Ranked - BNK48 3rd Generation</title>
        <meta name="description" content="a real time debut scores ranked of bnk48 3rd generation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
        <Row justify="space-around" align="middle">
          <Col span={12}>
            Updated At: 
            <div>
              <strong>{lastUpdated.toFormat('dd LLL yyyy, HH:mm:ss')}</strong>
            </div>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              loading={isLoading}
              onClick={() => getRanked()}
              icon={<ReloadOutlined />}
            >
              Refresh
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Table
              loading={isLoading}
              dataSource={ranked}
              columns={columns}
              pagination={false}
              bordered
            />
          </Col>
        </Row>
        <Divider />
        <Row justify="center" align="middle">
          <Col span={24} style={{ textAlign: 'center' }}>
            <Space>
              <Link href="https://www.facebook.com/bnk48official.minmin" passHref>
                <a target="_blank">
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    Minmin BNK48
                  </Tag>
                </a>
              </Link>
              <Link href="https://www.facebook.com/minminbnk48.fc" passHref>
                <a target="_blank">
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    Minmin BNK48 Thailand Fanclub
                  </Tag>
                </a>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}

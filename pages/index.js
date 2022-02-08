import 'antd/dist/antd.min.css'
import Head from 'next/head'
import { Button, Divider, Row, Col, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { DateTime } from 'luxon'

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
    setRanked(data.ranked)
    setLoading(false)
  }

  useEffect(() => {
    getRanked()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      align: 'right',
      sorter: {
        compare: (a, b) => a.score - b.score,
      },
    }
  ]

  return (
    <div>
      <Head>
        <title>BNK48 3rd Generation - Debut Scores</title>
        <meta name="description" content="a real time debut scores" />
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
            <Button type="primary" loading={isLoading} onClick={() => getRanked()}>
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
      </div>
    </div>
  )
}

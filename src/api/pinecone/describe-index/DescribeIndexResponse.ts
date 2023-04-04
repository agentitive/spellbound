export type DescribeIndexResponse = {
  database: {
    name: string
    metric: string
    dimension: number
    replicas: number
    shards: number
    pods: number
    pod_type: string
  }
  status: {
    waiting: string[]
    crashed: string[]
    host: string
    port: number
    state: string
    ready: boolean
  }
}

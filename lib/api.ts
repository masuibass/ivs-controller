import jwt from 'jsonwebtoken'

const API_URL = 'http://localhost:8080'
const IVS_PATH = '/ivs'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET

export const createToken = () => {
  if (API_SECRET) {
    const token = jwt.sign({ iss: API_KEY }, API_SECRET, { expiresIn: 30 })
    return token
  }
}

export const listIVSChannel = async () => {
  const response = await fetch(`${API_URL}${IVS_PATH}/`, {
    headers: {
      authorization: `Bearer ${createToken()}`,
    },
  })
  const json = await response.json()
  return json
}

export const getIVSChannel = async (channelArn: string) => {
  const response = await fetch(
    `${API_URL}${IVS_PATH}/${encodeURIComponent(channelArn)}`,
    {
      headers: {
        authorization: `Bearer ${createToken()}`,
      },
    }
  )
  const json = await response.json()
  return json
}

export const deleteIVSChannel = async (channelArn: string) => {
  const response = await fetch(
    `${API_URL}${IVS_PATH}/${encodeURIComponent(channelArn)}`,
    {
      method: 'delete',
      headers: {
        authorization: `Bearer ${createToken()}`,
      },
    }
  )
  const json = await response.json()
  return json
}

type CreateChannelOption = {
  name: string
  latencyMode?: string
  type?: string
  authorized?: boolean
  recordingConfigurationArn?: string
  tags?: object
}

export const createIVSChannel = async ({
  name,
  latencyMode,
  type,
  authorized,
  recordingConfigurationArn,
  tags,
}: CreateChannelOption) => {
  const response = await fetch(`${API_URL}${IVS_PATH}`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: `Bearer ${createToken()}`,
    },
    body: JSON.stringify({
      name,
      latencyMode,
      type,
      authorized,
      recordingConfigurationArn,
      tags,
    }),
  })
  const json = await response.json()
  return json
}

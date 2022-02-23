import express, { Application, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
import qs from 'qs'
import cors from 'cors'
import helmet from 'helmet'
// @ts-ignore
import { decycle } from 'cycle'
import {
  IvsClient,
  ListChannelsCommand,
  GetChannelCommand,
  ListStreamKeysCommand,
  GetStreamKeyCommand,
  StreamKeySummary,
  CreateChannelCommand,
  DeleteChannelCommand,
} from '@aws-sdk/client-ivs'
import jwt, { JwtPayload } from 'jsonwebtoken'

dotenv.config()
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

const ivsClient = new IvsClient({ region: process.env.AWS_REGION })

const app: Application = express()
const PORT = 8080

// Helmet
app.use(helmet())

// JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS
const allowedOrigins = ['http://localhost:3000']
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
}
app.use(cors(corsOptions))

// Logs
const accessLogStream = fs.createWriteStream(
  path.resolve(__dirname, '../log/access.log'),
  { flags: 'a' }
)
app.use(morgan('combined', { stream: accessLogStream }))

app.use((req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  const payload = jwt.verify(token!, API_SECRET!) as JwtPayload
  if (API_KEY === payload.iss && Date.now() / 1000 < payload.exp!) {
    next()
  } else {
    res.status(401).json({ message: 'Not authorized' })
  }
})

// Routes
app.get('/ivs', async (_req: Request, res: Response) => {
  const command = new ListChannelsCommand({})
  try {
    const response = await ivsClient.send(command)
    return res.status(200).json({
      data: response,
    })
  } catch (err) {
    return res
      .status(err.$response.statusCode)
      .json({ message: err.message, error: decycle(err) })
  } finally {
    ivsClient.destroy()
  }
})

app.get('/ivs/streamkey/:channelArn', async (req: Request, res: Response) => {
  const params = qs.parse(req.params)

  try {
    const listCommand = new ListStreamKeysCommand({
      channelArn: params.channelArn as string,
    })
    const listResponse = await ivsClient.send(listCommand)
    const streamKeyArn = (listResponse.streamKeys as StreamKeySummary[])[0]
      .arn as string
    const getCommand = new GetStreamKeyCommand({
      arn: streamKeyArn,
    })
    const getResponse = await ivsClient.send(getCommand)

    return res.status(200).json({
      data: getResponse,
    })
  } catch (err) {
    return res
      .status(err.$response.statusCode)
      .json({ message: err.message, error: decycle(err) })
  } finally {
    ivsClient.destroy()
  }
})

app.get('/ivs/:channelArn', async (req: Request, res: Response) => {
  const params = qs.parse(req.params)

  const command = new GetChannelCommand({
    arn: params.channelArn as string,
  })
  try {
    const response = await ivsClient.send(command)
    return res.status(200).json({
      data: response,
    })
  } catch (err) {
    return res
      .status(err.$response.statusCode)
      .json({ message: err.message, error: decycle(err) })
  } finally {
    ivsClient.destroy()
  }
})

app.post('/ivs', async (req: Request, res: Response) => {
  const {
    name,
    latencyMode,
    type,
    authorized,
    recordingConfigurationArn,
    tags,
  } = req.body
  const command = new CreateChannelCommand({
    name: name || 'createdByAPI',
    latencyMode: latencyMode || 'LOW',
    type: type || 'STANDARD',
    authorized: authorized || false,
    recordingConfigurationArn: recordingConfigurationArn || undefined,
    tags: tags || [],
  })
  try {
    const response = await ivsClient.send(command)
    return res.status(200).json({
      data: response,
    })
  } catch (err) {
    return res
      .status(err.$response.statusCode)
      .json({ message: err.message, error: decycle(err) })
  } finally {
    ivsClient.destroy()
  }
})

app.delete('/ivs/:channelArn', async (req: Request, res: Response) => {
  const params = qs.parse(req.params)
  const command = new DeleteChannelCommand({
    arn: params.channelArn as string,
  })
  try {
    const response = await ivsClient.send(command)
    return res.status(200).json({
      data: response,
    })
  } catch (err) {
    return res
      .status(err.$response.statusCode)
      .json({ message: err.message, error: decycle(err) })
  } finally {
    ivsClient.destroy()
  }
})

try {
  app.listen(PORT, () => {
    console.log(
      `${process.env.ENV} server running at: http://localhost:${PORT}`
    )
  })
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message)
  }
}

import { NextPage } from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import { Channel } from '@aws-sdk/client-ivs'
import { Oval } from 'react-loader-spinner'

import ChannelCard, { channelProps } from '../components/ChannelCard'
import CreateChannelForm from '../components/CreateChannelForm'
import { listIVSChannel } from '../lib/api'
import ToggleSwitch from '../components/ToggleSwitch'

interface Props {}

const Home: NextPage<Props> = () => {
  const { data, error, isValidating } = useSWR('list', listIVSChannel)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 space-y-8 text-center">
        <div className="relative">
          <div
            className="flex flex-col items-center space-y-4"
            style={isValidating ? { opacity: 0.5 } : { opacity: 1 }}
          >
            {!error &&
              data &&
              data.data.channels.map(
                ({
                  name: channelName,
                  arn: channelArn,
                  tags: channelTags,
                  ...rest
                }: Channel) => {
                  const props: channelProps = {
                    channelName: channelName || 'undefined',
                    channelArn: channelArn || '',
                  }
                  return <ChannelCard key={channelArn} {...props} />
                }
              )}
          </div>
          <div className="absolute mb-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="relative flex items-center w-12 h-12">
              {isValidating && <Oval width="100%" height="100%" />}
            </div>
          </div>
        </div>

        <CreateChannelForm />
      </main>
    </div>
  )
}

export default Home

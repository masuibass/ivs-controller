import React, { useState } from 'react'
import { mutate } from 'swr'
import { createIVSChannel } from '../lib/api'

type Props = {}

const CreateChannelForm: React.FC<Props> = () => {
  const [channelName, setChannelName] = useState<string>('')

  return (
    <div>
      <label>
        <span className="mr-2 text-sm text-gray-600">Channel Name:</span>
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="px-4 py-2 text-gray-600 border rounded-full shadow-lg"
        />
      </label>
      <button
        className="px-4 py-2 text-gray-600 border rounded-full shadow-lg"
        onClick={async () => {
          await createIVSChannel({
            name: channelName,
          })
          mutate('list')
        }}
      >
        Create
      </button>
    </div>
  )
}

export default CreateChannelForm

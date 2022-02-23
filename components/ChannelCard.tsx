import React from 'react'
import { AiOutlineDelete as DeleteIcon } from 'react-icons/ai'
import { mutate } from 'swr'
import { deleteIVSChannel } from '../lib/api'
export interface channelProps {
  channelName: string
  channelArn: string
}

const ChannelCard: React.FC<channelProps> = ({ channelName, channelArn }) => {
  const handleClickDelete = async () => {
    await deleteIVSChannel(channelArn)
    mutate('list')
  }

  return (
    <div className="flex flex-col items-start px-8 py-4 border shadow-lg rounded-xl">
      <div className="flex items-center justify-between w-full">
        <h3 className="flex-grow text-lg font-semibold text-left">
          {channelName}
        </h3>
        <button onClick={handleClickDelete}>
          <DeleteIcon />
        </button>
      </div>
      <div>
        <span className="mr-2 text-xs text-gray-500">ChannelArn:</span>
        <span className="text-sm text-gray-600">{channelArn}</span>
      </div>
    </div>
  )
}

export default ChannelCard

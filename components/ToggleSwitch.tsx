import React, { FormEventHandler } from 'react'

type switchProps = {
  isToggled: boolean
  onChange?: FormEventHandler
}

const ToggleSwitch: React.FC<switchProps> = ({ isToggled, onChange }) => {
  return (
    <label className="relative inline-block w-10 h-5">
      <input
        type="checkbox"
        checked={isToggled}
        onChange={onChange}
        className="hidden"
      />
      <span
        className="absolute top-0 bottom-0 left-0 right-0 transition-colors rounded-full cursor-pointer"
        style={
          isToggled
            ? { background: 'rgb(75 85 99)' }
            : { background: 'rgb(209 213 219)' }
        }
      />
      <span
        className="absolute top-[0.125rem] right-[0.125rem] h-4 w-4 rounded-full bg-white transition-transform"
        style={
          isToggled
            ? { transform: 'translate(0, 0)' }
            : { transform: 'translate(-1.25rem, 0)' }
        }
      />
    </label>
  )
}

export default ToggleSwitch

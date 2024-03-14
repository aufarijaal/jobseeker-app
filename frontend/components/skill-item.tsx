import { Cross2Icon } from '@radix-ui/react-icons'
import React from 'react'

interface Props {
  children: React.ReactNode | string
  isEditing: boolean
  onRemoveBtnClick: () => void
}

const SkillItem: React.FC<Props> = ({
  children,
  isEditing,
  onRemoveBtnClick,
}) => {
  return (
    <div className="tag-item">
      {children}
      {isEditing && (
        <button className="button-remove-tag" onClick={onRemoveBtnClick}>
          <Cross2Icon />
        </button>
      )}
    </div>
  )
}

export default SkillItem

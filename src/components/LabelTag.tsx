import * as React from 'react'

// I don't even know what I'm doing
interface LabelTagProps<T = React.ElementType> extends React.HTMLAttributes<T> {
  as?: T
  additionStyles: string
}

function LabelTag({ as: Component = 'li', additionStyles, ...props }: LabelTagProps) {
  return React.createElement(Component, {
    className: `flex items-center gap-1 rounded-sm px-1 text-slate-900 ${additionStyles}`,
    ...props,
  })
}

export default LabelTag

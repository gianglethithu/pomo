import { Disclosure } from '@headlessui/react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

interface QuestionProps {
  question: string
  answer: JSX.Element
  defaultOpen?: boolean
}

function Question({ question, answer, defaultOpen = false }: QuestionProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex items-center justify-between gap-2 rounded-lg border-2 border-sky-800 py-2 px-4'>
            {question}
            {open ? <BsChevronDown /> : <BsChevronUp />}
          </Disclosure.Button>
          <Disclosure.Panel className='px-4'>{answer}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Question

import { PageLayout } from '../../components'
import Question from './Question'

interface AboutProps {}

function About({}: AboutProps) {
  return (
    <PageLayout title='About'>
      <div className='scrollbar h-[calc(100vh-theme(space.24))] overflow-y-auto'>
        <div className='mx-auto flex max-w-xl flex-col gap-4 '>
          <Question
            defaultOpen
            question='What is this app?'
            answer={
              <>
                <p>
                  This app is a significantly simplified version of WorkingHours made by Timo Partl
                  (
                  <a
                    href='https://timopartl.com/?app=WorkingHours'
                    target='_blank'
                    rel='noreferrer'
                    className='text-sky-500'
                  >
                    https://timopartl.com/?app=WorkingHours
                  </a>
                  ). It is made for learning purposes only, so if you want features in the original
                  app, please consider purchasing the full version of that.
                </p>
                <p className='mt-2 italic'>
                  I make this app mainly for large screen size devices, so there is a handful of
                  visual problems when using this on a small screen. I might fix this in the future.
                </p>
              </>
            }
          />

          <Question
            question='What features does it have?'
            answer={
              <>
                This app only contains features that I use daily:
                <ul className='list-inside list-disc'>
                  <li>Tracking working time each day</li>
                  <li>Adding task and tag to describe work</li>
                  <li>Represent recorded data in a graph to track my progress</li>
                  <li>Pomodoro timer to improve concentration while working</li>
                </ul>
              </>
            }
          />

          <Question
            question="Why don't you implement the setting page?"
            answer={
              <>
                I've modified the app to fit my need, and I am the only user of this app, so I don't
                need any settings for now.
              </>
            }
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default About

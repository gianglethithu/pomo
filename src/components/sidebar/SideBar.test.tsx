import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SideBar } from '..'

test('expand sidebar when click button', async () => {
  const user = userEvent.setup()
  render(<SideBar />, { wrapper: MemoryRouter })

  const taskIconText = screen.getByText(/tasks/i)
  expect(taskIconText).toBeInTheDocument()
  const toggleButton = screen.getByRole('button')
  await user.click(toggleButton)
  expect(taskIconText).not.toBeInTheDocument()
})

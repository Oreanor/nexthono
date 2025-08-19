import React from 'react'
import { render, screen } from '@testing-library/react'
import AddUserModal from '@/app/components/AddUserModal'

describe('AddUserModal', () => {
  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal when isOpen is true', () => {
    render(
      <AddUserModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit}
        error={null}
      />
    )

    expect(screen.getByText('Добавить пользователя')).toBeInTheDocument()
  })

  it('should not render modal when isOpen is false', () => {
    render(
      <AddUserModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit}
        error={null}
      />
    )

    expect(screen.queryByText('Добавить пользователя')).not.toBeInTheDocument()
  })

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Ошибка создания пользователя'
    
    render(
      <AddUserModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit}
        error={errorMessage}
      />
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should not display error message when error prop is null', () => {
    render(
      <AddUserModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit}
        error={null}
      />
    )

    expect(screen.queryByText('Ошибка создания пользователя')).not.toBeInTheDocument()
  })
})

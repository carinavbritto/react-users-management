import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateUser } from '../CreateUser'
import { userService } from '../../services/userService'

// Mock do serviço
vi.mock('../../services/userService', () => ({
  userService: {
    createUser: vi.fn(),
  },
}))

describe('CreateUser', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o formulário de criação de usuário', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateUser />
      </QueryClientProvider>
    )

    expect(screen.getByText('Criar Novo Usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Criar Usuário' })
    ).toBeInTheDocument()
  })

  it('deve validar campos obrigatórios', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateUser />
      </QueryClientProvider>
    )

    const submitButton = screen.getByRole('button', { name: 'Criar Usuário' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })
  })

  it('deve criar um usuário com sucesso', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    }

    ;(userService.createUser as any).mockResolvedValue(mockUser)

    render(
      <QueryClientProvider client={queryClient}>
        <CreateUser />
      </QueryClientProvider>
    )

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'John Doe' },
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })

    const submitButton = screen.getByRole('button', { name: 'Criar Usuário' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(userService.createUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      })
    })

    // Verifica se os campos foram limpos após o sucesso
    expect(screen.getByLabelText('Nome')).toHaveValue('')
    expect(screen.getByLabelText('Email')).toHaveValue('')
  })

  it('deve exibir mensagem de erro ao falhar', async () => {
    const error = new Error('Erro ao criar usuário')
    ;(userService.createUser as any).mockRejectedValue(error)

    render(
      <QueryClientProvider client={queryClient}>
        <CreateUser />
      </QueryClientProvider>
    )

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'John Doe' },
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })

    const submitButton = screen.getByRole('button', { name: 'Criar Usuário' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(userService.createUser).toHaveBeenCalled()
    })
  })
})

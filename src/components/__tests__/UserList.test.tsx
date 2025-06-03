import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserList } from '../UserList'
import { userService } from '../../services/userService'

// Mock do serviço
vi.mock('../../services/userService', () => ({
  userService: {
    listUsers: vi.fn(),
  },
}))

describe('UserList', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(userService.listUsers as any).mockResolvedValue(mockUsers)
  })

  it('deve renderizar a lista de usuários', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    )

    // Verifica se o título está presente
    expect(screen.getByText('Lista de Usuários')).toBeInTheDocument()

    // Aguarda a lista de usuários ser carregada
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem de carregamento', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    )

    expect(screen.getByText('Carregando usuários...')).toBeInTheDocument()
  })

  it('deve exibir mensagem de erro', async () => {
    ;(userService.listUsers as any).mockRejectedValue(
      new Error('Erro ao carregar usuários')
    )

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar usuários')).toBeInTheDocument()
    })
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserDetails } from '../UserDetails'
import { userService } from '../../services/userService'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock do serviço
vi.mock('../../services/userService', () => ({
  userService: {
    getUserById: vi.fn(),
    getEnrichedUser: vi.fn(),
  },
}))

describe('UserDetails', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  }

  const mockEnrichedUser = {
    ...mockUser,
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    status: 'completed' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(userService.getUserById as any).mockResolvedValue(mockUser)
    ;(userService.getEnrichedUser as any).mockResolvedValue(mockEnrichedUser)
  })

  it('deve renderizar os detalhes do usuário', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/users/1']}>
          <Routes>
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(
      screen.getByText('Carregando detalhes do usuário...')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Detalhes do Usuário')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(
        screen.getByText('https://linkedin.com/in/johndoe')
      ).toBeInTheDocument()
      expect(screen.getByText('https://github.com/johndoe')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem de processamento', async () => {
    ;(userService.getEnrichedUser as any).mockResolvedValue({
      ...mockUser,
      status: 'processing' as const,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/users/1']}>
          <Routes>
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Dados em processamento...')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem de erro', async () => {
    ;(userService.getUserById as any).mockRejectedValue(
      new Error('Usuário não encontrado')
    )

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/users/1']}>
          <Routes>
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument()
    })
  })
})

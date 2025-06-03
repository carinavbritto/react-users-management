import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { EnrichedUser } from '../types/user'

export function UserDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  })

  const { data: enrichedUser, isLoading: isLoadingEnriched } = useQuery({
    queryKey: ['enrichedUser', id],
    queryFn: () => userService.getEnrichedUser(id!),
    enabled: !!id,
  })

  if (isLoadingUser || isLoadingEnriched) {
    return <div className="p-4">Carregando detalhes do usuário...</div>
  }

  if (!user) {
    return <div className="p-4 text-red-500">Usuário não encontrado</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Usuário</h1>
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>

        {enrichedUser?.status === 'processing' && (
          <p className="text-yellow-600">Dados em processamento...</p>
        )}

        {enrichedUser?.status === 'completed' && (
          <div className="space-y-2">
            {enrichedUser.linkedin && (
              <p>
                <span className="font-medium">LinkedIn:</span>{' '}
                <a
                  href={enrichedUser.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {enrichedUser.linkedin}
                </a>
              </p>
            )}
            {enrichedUser.github && (
              <p>
                <span className="font-medium">GitHub:</span>{' '}
                <a
                  href={enrichedUser.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {enrichedUser.github}
                </a>
              </p>
            )}
          </div>
        )}

        {enrichedUser?.status === 'error' && (
          <p className="text-red-500">Erro ao carregar dados enriquecidos</p>
        )}
      </div>
    </div>
  )
}

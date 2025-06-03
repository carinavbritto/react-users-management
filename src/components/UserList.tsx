import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { Link } from 'react-router-dom'

export function UserList() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.listUsers,
  })

  if (isLoading) {
    return <div className="p-4">Carregando usuários...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar usuários</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
      <div className="space-y-2">
        {users?.map((user) => (
          <Link
            key={user.id}
            to={`/users/${user.id}`}
            className="block p-4 bg-white rounded shadow hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

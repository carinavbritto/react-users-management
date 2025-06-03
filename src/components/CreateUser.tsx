import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { CreateUserDTO } from '../types/user'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
})

export function CreateUser() {
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: '',
    email: '',
  })
  const [errors, setErrors] = useState<Partial<CreateUserDTO>>({})
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setFormData({ name: '', email: '' })
      setErrors({})
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = createUserSchema.parse(formData)
      mutate(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<CreateUserDTO> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof CreateUserDTO] = err.message
          }
        })
        setErrors(formattedErrors)
      }
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Usuário</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPending ? 'Criando...' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  )
}

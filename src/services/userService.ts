import { userServiceApi, enrichmentServiceApi } from './api'
import type { User, EnrichedUser, CreateUserDTO } from '../types/user'

export const userService = {
  async listUsers(): Promise<User[]> {
    const { data } = await userServiceApi.get<User[]>('/users')
    return data
  },

  async createUser(userData: CreateUserDTO): Promise<User> {
    const { data } = await userServiceApi.post<User>('/users', userData)
    return data
  },

  async getUserById(id: string): Promise<User> {
    const { data } = await userServiceApi.get<User>(`/users/${id}`)
    return data
  },

  async getEnrichedUser(uuid: string): Promise<EnrichedUser> {
    const { data } = await enrichmentServiceApi.get<EnrichedUser>(
      `/users/enriched/${uuid}`
    )
    return data
  },
}

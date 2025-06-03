export interface User {
  id: string
  name: string
  email: string
}

export interface EnrichedUser extends User {
  linkedin?: string
  github?: string
  status: 'processing' | 'completed' | 'error'
}

export interface CreateUserDTO {
  name: string
  email: string
}

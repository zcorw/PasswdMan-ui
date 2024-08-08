export interface Password {
  id: string
  name: string
  username: string
  password: string
  uri: string[]
  fields: string
  createdAt: string
  updatedAt: string
  groupId: string
}

export interface Note {
  id: string
  name: string
  note: string
  uri: string[]
  fields: string
  createdAt: string
  updatedAt: string
  groupId: string
}

export interface Group {
  id: string
  title: string
  checked: boolean
}

export interface PwListItem {
  createTime: string
  fields: string
  name: string
  pId: string
  password: string
  updateTime: string
  uri: string
  username: string
}

export interface GroupsItem {
  id: string
  title: string
}

export interface PasswordParams {
  text?: string
  id?: string
  groupId?: string
}

export interface CreatePassword {
  name: string
  username?: string
  password: string
  uri?: string[]
  fields?: string
  groupId: string
}
export interface Prompt {
  id: string
  owner_id: string
  title: string
  description: string | null
  content: string
  visibility: 'private' | 'link'
  created_at: string
  updated_at: string
}

export interface PromptInput {
  title: string
  description: string
  content: string
}

export type SortKey = 'updated' | 'created' | 'title'

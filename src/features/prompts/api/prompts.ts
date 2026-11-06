import { supabase } from '../../../lib/supabase'
import type { Prompt, PromptInput, SortKey } from '../types'

const COLUMNS = 'id,owner_id,title,description,content,visibility,created_at,updated_at'

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const id = data.session?.user.id
  if (!id) throw new Error('You’re signed out. Sign in again.')
  return id
}

// Turns "write blog" into a prefix query ("write:* & blog:*") so partial words match as you type.
function toTsQuery(search: string): string {
  return search
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
    .map((t) => `${t}:*`)
    .join(' & ')
}

export async function listPrompts(opts: { search?: string; sort?: SortKey; limit?: number } = {}): Promise<Prompt[]> {
  const { search = '', sort = 'updated', limit = 100 } = opts
  let query = supabase.from('prompts').select(COLUMNS)
  const tsq = toTsQuery(search)
  if (tsq) query = query.textSearch('search_vector', tsq, { config: 'english' })
  const order =
    sort === 'title'
      ? { column: 'title', ascending: true }
      : { column: sort === 'created' ? 'created_at' : 'updated_at', ascending: false }
  const { data, error } = await query.order(order.column, { ascending: order.ascending }).limit(limit)
  if (error) throw error
  return data as unknown as Prompt[]
}

export async function getPrompt(id: string): Promise<Prompt | null> {
  const { data, error } = await supabase.from('prompts').select(COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data as unknown as Prompt | null
}

export async function countPrompts(): Promise<number> {
  const { count, error } = await supabase.from('prompts').select('id', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export async function createPrompt(input: PromptInput): Promise<Prompt> {
  const owner_id = await requireUserId()
  const { data, error } = await supabase
    .from('prompts')
    .insert({ owner_id, title: input.title.trim(), description: input.description.trim() || null, content: input.content })
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data as unknown as Prompt
}

export async function updatePrompt(id: string, input: PromptInput): Promise<Prompt> {
  const { data, error } = await supabase
    .from('prompts')
    .update({ title: input.title.trim(), description: input.description.trim() || null, content: input.content })
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data as unknown as Prompt
}

export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabase.from('prompts').delete().eq('id', id)
  if (error) throw error
}

export async function duplicatePrompt(id: string): Promise<Prompt> {
  const original = await getPrompt(id)
  if (!original) throw new Error('That prompt no longer exists.')
  return createPrompt({
    title: `${original.title.slice(0, 190)} (copy)`,
    description: original.description ?? '',
    content: original.content,
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { countPrompts, createPrompt, deletePrompt, duplicatePrompt, getPrompt, listPrompts, updatePrompt } from '../api/prompts'
import type { PromptInput, SortKey } from '../types'

export function usePrompts(opts: { search?: string; sort?: SortKey; limit?: number } = {}) {
  return useQuery({ queryKey: ['prompts', 'list', opts], queryFn: () => listPrompts(opts) })
}

export function usePrompt(id: string | undefined) {
  return useQuery({ queryKey: ['prompts', 'detail', id], queryFn: () => getPrompt(id!), enabled: !!id })
}

export function usePromptCount() {
  return useQuery({ queryKey: ['prompts', 'count'], queryFn: countPrompts })
}

export function useCreatePrompt() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (input: PromptInput) => createPrompt(input), onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts'] }) })
}

export function useUpdatePrompt(id: string) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (input: PromptInput) => updatePrompt(id, input), onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts'] }) })
}

export function useDeletePrompt() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => deletePrompt(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts'] }) })
}

export function useDuplicatePrompt() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => duplicatePrompt(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['prompts'] }) })
}

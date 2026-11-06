import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import PublicOnlyRoute from './features/auth/components/PublicOnlyRoute'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import PromptsPage from './features/prompts/pages/PromptsPage'
import PromptViewPage from './features/prompts/pages/PromptViewPage'
import { EditPromptPage, NewPromptPage } from './features/prompts/pages/PromptEditorPage'
import CollectionsPage from './pages/CollectionsPage'
import SharedPage from './pages/SharedPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="prompts" element={<PromptsPage />} />
          <Route path="prompts/new" element={<NewPromptPage />} />
          <Route path="prompts/:id" element={<PromptViewPage />} />
          <Route path="prompts/:id/edit" element={<EditPromptPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="shared" element={<SharedPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

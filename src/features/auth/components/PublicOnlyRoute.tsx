import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import LoadingScreen from '../../../components/ui/LoadingScreen'

export default function PublicOnlyRoute() {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (session) return <Navigate to="/" replace />
  return <Outlet />
}

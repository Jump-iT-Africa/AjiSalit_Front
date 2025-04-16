import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/userSlice';

export default function Index() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(home)" />;
  }

  return <Redirect href="/(tabs)" />;
}
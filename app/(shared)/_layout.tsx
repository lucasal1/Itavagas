import { Stack } from 'expo-router';

export default function SharedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="job-details" />
      <Stack.Screen name="manage-jobs" />
      <Stack.Screen name="edit-job" />
    </Stack>
  );
}
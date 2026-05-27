// src/app/(auth)/register/page.tsx
// Redirect /register to /login

import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/login');
}

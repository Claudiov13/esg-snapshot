import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </section>
  );
}

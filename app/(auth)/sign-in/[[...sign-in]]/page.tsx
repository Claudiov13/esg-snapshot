import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </section>
  );
}

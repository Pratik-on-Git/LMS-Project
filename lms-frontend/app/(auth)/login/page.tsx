import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
    // Session check is now handled by the auth client on the client side
    // or via middleware redirect
    return <LoginForm />
}
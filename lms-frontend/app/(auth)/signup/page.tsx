import { SignUpForm } from "./_components/SignUpForm";

export default function SignUpPage() {
    // Session check is now handled by the auth client on the client side
    // or via middleware redirect
    return <SignUpForm />;
}
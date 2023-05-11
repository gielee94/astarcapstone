import { useMsal } from '@azure/msal-react';

export const SigninButton = () => {
    const { instance } = useMsal();

    const handleSignIn = () => {
        instance.loginRedirect({
            scopes: ['user.read']
        });
    }
    return (
        <button color='blue' onClick={handleSignIn}>signin</button>
    )
}
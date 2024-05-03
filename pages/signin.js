import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import 'bulma/css/bulma.css';
import { auth } from '../firebase/config';

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if user is already signed in
        const user = getAuth().currentUser;
        if (user) {
            // Redirect if user is already signed in
            router.push('/chatrooms');
        }
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const username = e.target.username.value;

        // Fetch the custom token from API
        const response = await fetch('api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            // Handle unsuccessful response
            console.error('Failed to fetch custom token');
            setIsLoading(false);
            return;
        }

        try {
            const { token } = await response.json();

            // Sign in with the custom token
            signInWithCustomToken(auth, token)
                .then(() => {
                    // Redirect to chatrooms page after successful sign-in
                    router.push('/chatrooms');
                })
                .catch((error) => {
                    console.error('Failed to sign in:', error);
                });
        } catch (error) {
            console.error('Error parsing response:', error);
        }
    };

    return (
        <section className="hero is-fullheight is-primary">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <form onSubmit={handleSignIn} className="box">
                                <div className="field">
                                    <label htmlFor="username" className="label">
                                        Username
                                    </label>
                                    <div className="control">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            className="input"
                                            required
                                            disabled={isLoading} // Disable input when loading
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <button type="submit" className="button is-primary" disabled={isLoading}>
                                            {isLoading ? 'Signing In...' : 'Sign In'}
                                        </button>
                                        {isLoading && <div className="button is-loading is-primary" />} {/* Loading spinner */}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

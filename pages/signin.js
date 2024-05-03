import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import 'bulma/css/bulma.css';
import { auth } from './firebase/config';
import { Router } from 'next/router';

export default function SignIn() {
    const router = useRouter();
    const handleSignIn = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;

        // Fetch the custom token from API
        const response = await fetch('api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const { token } = await response.json();

        // Sign in with the custom token
        signInWithCustomToken(auth, token)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                router.push('/chatrooms');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
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
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <button type="submit" className="button is-primary">
                                            Sign In
                                        </button>
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

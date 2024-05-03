import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '../firebase/config'; // Import the auth instance
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc, addDoc } from 'firebase/firestore'; // Import Firestore functions
import 'bulma/css/bulma.css';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';

export default function ChatroomsPage() {
    const router = useRouter();
    const [chatrooms, setChatrooms] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    // get current user from auth
    const user = auth.currentUser;
    const user_name = user.uid;
    // console.log(user_name)
    useEffect(() => {
        // Check if the user is authenticated
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, set the username
                setUsername(user.displayName);

                // Load chatrooms from Firestore
                const db = getFirestore(); // Get Firestore instance
                const chatroomsRef = collection(db, 'chatrooms');
                // const chatroomsQuery = query(chatroomsRef, where('user', '==', user_name));
                const chatroomsQuery = query(chatroomsRef);

                const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
                    const rooms = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setChatrooms(rooms);
                });

                return () => {
                    // Detach listeners on unmount
                    unsubscribeChatrooms();
                };
            } else {
                // User is not signed in, redirect to sign-in page
                router.push('/signin');
            }
        });

        return () => {
            // Detach auth state change listener on unmount
            unsubscribe();
        };
    }, [router]);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleCreateChatroom = async () => {
        if (input.length === 4 && !chatrooms.some(room => room.id === input)) {
            const db = getFirestore();
            const chatroomsCollection = collection(db, 'chatrooms');

            // Add a new document to the "chatrooms" collection with an auto-generated ID
            await addDoc(chatroomsCollection, {
                id: input,
                createdAt: new Date(),
                user: user_name
            });

            setInput('');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/signin');
    }

    return (
        <div className="container">
            <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link href="/">
                        <span className="navbar-item" href="/">ChatApp</span>
                    </Link>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Link href="/chatrooms">
                            <span className={`navbar-item ${router.pathname === '/chatrooms' ? 'is-active' : ''}`}>
                                Chatrooms
                            </span>
                        </Link>
                        <Link href="/about">
                            <span className={`navbar-item ${router.pathname === '/about' ? 'is-active' : ''}`}>
                                About
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <button className="button is-danger" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="section">
                <h1 className="title">Home</h1>
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input className="input" type="text" placeholder="Enter a four-digit chatroom number" value={input} onChange={handleInputChange} />
                    </div>
                    <div className="control">
                        <button className="button is-info" onClick={handleCreateChatroom}>Create Chatroom</button>
                    </div>
                </div>
                <div className="box">
                    <h2 className="subtitle">All Chatrooms</h2>
                    <ul>
                        {chatrooms.map(room => (
                            <li key={room.id}><Link href={`/chatroom?id=${room.id}`}>{room.id}</Link></li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}

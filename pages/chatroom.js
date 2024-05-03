import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, onSnapshot, collection, addDoc, query, orderBy } from 'firebase/firestore';
import 'bulma/css/bulma.css';
import Link from 'next/link';
import { signOut } from 'firebase/auth';

export default function ChatroomPage() {
    const router = useRouter();
    const { id } = router.query; // Get the chatroom ID from the URL
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!id) return; // Prevents running on initial render when id is undefined

        const db = getFirestore();
        const messagesRef = collection(db, 'chatrooms', id, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const loadedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()   
            }));
            setMessages(loadedMessages);
        });

        return () => unsubscribe();
    }, [id]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const db = getFirestore();
        const messagesRef = collection(db, 'chatrooms', id, 'messages');
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: new Date(),
            user: 'username' // This should be dynamic based on the logged-in user
        });
        setNewMessage('');
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    }

    return (
        <div className="container">
            <nav className="navbar is-light" role="navigation" aria-label="main navigation">
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
            <h1 className="title">Chat Room: {id}</h1>
            <div className="box">
                {messages.map(msg => (
                    <div key={msg.id} className="message">
                        <p><strong>{msg.user}:</strong> {msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="field has-addons">
                <div className="control is-expanded">
                    <input className="input" type="text" placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                </div>
                <div className="control">
                    <button className="button is-link" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

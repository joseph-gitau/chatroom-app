import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, onSnapshot, collection, addDoc, query, orderBy } from 'firebase/firestore';
import 'bulma/css/bulma.css';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaUser } from "react-icons/fa";

export default function ChatroomPage() {
    const router = useRouter();
    const { id } = router.query; // Get the chatroom ID from the URL
    // console.log(id);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    console.log(useState)

    const user = auth.currentUser;
    console.log(user);

    const user_name = user.uid;

    useEffect(() => {
        if (!id) return; // Prevents running on initial render when id is undefined

        if (!user) {
            router.push('/signin');
            // return;
        } else {
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
        }
    }, [id]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const db = getFirestore();
        const messagesRef = collection(db, 'chatrooms', id, 'messages');
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: new Date(),
            user: user_name
        });
        setNewMessage('');
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
                            <span className={`navbar-item ${router.pathname === '/chatrooms' ? 'is-active' : ''}`}>Chatrooms</span>
                        </Link>
                        <Link href="/about">
                            <span className={`navbar-item ${router.pathname === '/about' ? 'is-active' : ''}`}>About</span>
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
            <div className="box content">
                {messages.map(msg => (
                    <article key={msg.id} className="media">
                        <figure className="media-left">
                            <p className="image is-64x64">
                                <span className="icon has-text-info">
                                    <FaUser size="3x" position="center" />
                                </span>
                            </p>
                        </figure>
                        <div className="media-content">
                            <div className="content">
                                <p>
                                    <strong>{msg.user}</strong>
                                    <br />
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <div className="field has-addons">
                <div className="control is-expanded">
                    <input className="input is-info" type="text" placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                </div>
                <div className="control">
                    <button className="button is-link" onClick={sendMessage}>Send</button>
                    <button className="button is-warning" onClick={() => setNewMessage('')}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

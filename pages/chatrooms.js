import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from './firebase/config'; // Import the auth instance
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import 'bulma/css/bulma.css';

export default function ChatroomsPage() {
    const [chatrooms, setChatrooms] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const currentUser = auth.currentUser; // Get the current user from the auth instance

        if (currentUser) {
            setUsername(currentUser.displayName);
        }

        const db = getFirestore(); // Get Firestore instance
        const chatroomsRef = collection(db, 'chatrooms');
        const chatroomsQuery = query(chatroomsRef, where('user', '==', username));

        const unsubscribe = onSnapshot(chatroomsQuery, (snapshot) => {
            const rooms = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChatrooms(rooms);
        });

        return () => unsubscribe();
    }, [username]);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleCreateChatroom = async () => {
        if (input.length === 4 && !chatrooms.some(room => room.id === input)) {
            const db = getFirestore();
            const chatroomRef = doc(collection(db, 'chatrooms'), input); // Specify document reference
            await setDoc(chatroomRef, {
                createdAt: new Date(),
                user: username
            });
            setInput('');
        }
    };


    return (
        <div className="container">
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
                    <h2 className="subtitle">Your Chatrooms</h2>
                    <ul>
                        {chatrooms.map(room => (
                            <li key={room.id}><Link href={`/chatroom?${room.id}`}>{room.id}</Link></li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}

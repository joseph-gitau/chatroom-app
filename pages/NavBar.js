import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust the path as necessary

const NavBar = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login'); // Redirect to login page after logout
    };

    return (
        <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link href="/">
                    <a className="navbar-item" href="/">ChatApp</a>
                </Link>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link href="/chatrooms">
                        <a className={`navbar-item ${router.pathname === '/chatrooms' ? 'is-active' : ''}`}>
                            Chatrooms
                        </a>
                    </Link>
                    <Link href="/about">
                        <a className={`navbar-item ${router.pathname === '/about' ? 'is-active' : ''}`}>
                            About
                        </a>
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <button className="button is-danger" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

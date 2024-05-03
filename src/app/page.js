import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="container">
            <section className="hero is-fullheight is-primary">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title">
                            Simple ChatRoom
                        </h1>
                        <p className="subtitle">
                            Connect and chat in real-time
                        </p>
                        <Link href="signin">
                            <span className="button is-large is-success">Sign In</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

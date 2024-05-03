import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            // Replace with your Firebase project credentials
            projectId: "chatroom-app-9ed9f",
            clientEmail: "firebase-adminsdk-qywgd@chatroom-app-9ed9f.iam.gserviceaccount.com",
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaKavXlMjY+fX/\nO+I3u78GWnIeS98/QZxfAxx0ttmNQwVqCUlfUUWN2WlNLkMkFvfcW0+h+VGtPe70\n133p5OaS4/meDPSnblf1BgwNpaHxJIbtM0oXNVUlQVBvNFi0dICf46pDewy3CiQD\n28ikKyg+VBuFSucvlT5USg/CTYBCk01+Y7XB/BSlnR2UgpI7WpMoJkiE3Z0pjZ1x\nTfyIztJMuRbxtX1j7oTMuXl7Z8gQNYd2k/b3W2L7wCPx+Qpbe3lFHN967UBV5p4F\nsD7MAPRD+HLsIROmYfkSw0wbjSE+rbxtVtTw9OQK5OHlZhgFTSbGgIC31bGuqp7m\n2mTbCHDdAgMBAAECggEAJE9kViaJF/Hn6vHj2lSyLYDoGBKuxmthtU86SJM4snjy\nsYL2cSjnRP3MO42F6t4uCwzGuNPMVQ2dVrXaxlhPppFjncJXbYgj12ZROHWmqvF7\nhirqbIT3RQsZMtgVfItkMESjObmlyQbubKo7m88+b0/IG6EEysRQJfI7u/wdFZDW\nvI+TJ3P5C/YYRNEw//UaXtzIkNVs9pX94jUe+5lISiJYM0EYBFhTKQZYFBooR7ZF\n5lWm3PqUIh8OJ316wJGSCmx4b0dqnEjdXrh6VBKHExhQVIRwJPYKcFNqI8ORuywi\nDNF0uKs6CEnQ0dpsXC6QE+rrzj4kz7x3apLnkyyHUQKBgQDJULSweaEmm8/L8gKu\nXlqnart+cew0irR0JmBpvfgEnC0JyPykNXu/BdbjBQ8C3boJHtDilRt1i2PfXZ7Z\n9PWRzyuIAaLDtRV96F8glUOYkRGClO3r+seElCI5Njtyr6XkDPpoV0k5U71Z4vz5\nTXmoIP4yfVmgFHERRl8gtsvxpwKBgQDECgWH2lBwqOVUX2g+VHC5UsJMmeifSH40\nGkCLBNCA0CWWDhlRB/dkK7HPigMe/QmhSwhRLCj0uXqUeZ+9qtimtumqVatxORKB\n+Hfomm6g7eMZydHkUEkRWIUruFAyl9KfHE5Vvp83fl8JxdsvdV926P3mDs03Yli/\nEJ8NpKpx2wKBgAjofVZhy3O96VAJAX1dx30pB+rsd5tLl/ibyiBju5nYn1WTgzpw\n82zcgUnCa4ug7B6DMpMULgbhiCXWKrVSVZuCI1b9W4p1dOIBalQyxq71nGS+2lha\n3IFNXMZTVAYbJ6gTuvDrC95xiit0E+WkPAHok9cAHPssbGRrTMJR1Gx5AoGAYIQ2\nmN4pQG5HCjU204krPnK6apBT8Sf1yp0qLcefB+xytOAYIsbzTAQfNPjT9IvME/cn\nDx/YwjQXX8ZJmU3mAJ6JiG1JTSM2M3srPf/ae6zjZKzyg5/reXjFh/LkuSP6dI+x\nGZISPXYgQGWDNmhpKdgoOP4Mlzn6S4dZZ5QsvoUCgYEAk/wlkTaFqDlIYOookRzD\niqMcowQdXkx3sk5oi9kSyCrDL1ZtILSLPSl/qBTg0JAfn9t+zxRNn192+FvFxJ1V\nCjPRueK0QkKdb0k7nP3z4FaMpKx8WrQQnXGZaL/N9x4QqnW2uJhfC1RD6OSlOvsV\nrHysJvy6yyjNr9WQr5p9tE4=\n-----END PRIVATE KEY-----\n",
        }),
        databaseURL: "https://chatroom-app-9ed9f.firebaseio.com",
    });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const { username } = req.body;

    // Generate a unique ID for the user
    const userRef = admin.firestore().collection('users').doc(username);

    // Include the username and timestamp in the user document
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await userRef.set({
        username,
        displayName: username,
        createdAt: timestamp
    });

    const uid = userRef.id; // Unique identifier for the user
    const customToken = await admin.auth().createCustomToken(uid);

    res.status(200).json({ token: customToken });
};


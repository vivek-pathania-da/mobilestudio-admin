import * as admin from 'firebase-admin';

function getFirebaseAdmin(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  if (!projectId || !clientEmail || !privateKey || !databaseURL) {
    throw new Error(
      'Missing Firebase environment variables. ' +
        'Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, ' +
        'FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL'
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL,
  });
}

export async function notifyThemeUpdated(customerId: string): Promise<void> {
  try {
    const app = getFirebaseAdmin();
    const db = admin.database(app);
    const ref = db.ref(`Users/${customerId}/lastUpdatedAt`);
    const timestamp = new Date().toISOString();
    await ref.set(timestamp);
    console.log(
      `[Firebase] Theme notification sent for customer ${customerId}: ${timestamp}`
    );
  } catch (error) {
    console.error(
      `[Firebase] Failed to notify theme update for customer ${customerId}:`,
      error
    );
  }
}

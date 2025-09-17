import { Router } from "~/components/router/Router";
import { setupFirebase } from "~/lib/firebase";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { useSignIn, useSignOut } from "~/components/contexts/UserContext";

function Main() {
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  useEffect(() => {
    setupFirebase();

    const auth = getAuth();

    // Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          console.log('Redirect result:', result);
          signIn(result.user);
        }
      })
      .catch((error) => {
        console.error('Redirect error:', error);
      });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        signIn(user);
      } else {
        signOut();
      }
    });

    return () => unsubscribe();
  }, [signIn, signOut]);

  return (
    <main>
      <Router />
    </main>
  );
}

export default Main;

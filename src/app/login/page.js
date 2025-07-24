'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorPopup, setErrorPopup] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  if (status === 'loading') return null;
  if (session) {
    router.push('/');
    return null;
  }

  const showError = (message) => {
    setErrorPopup(message);
    setTimeout(() => setErrorPopup(''), 3000); // hide after 3s
  };

  const handleAuth = async () => {
    setErrorPopup('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return showError('Email este necesar!');
    }

    if (!emailRegex.test(email)) {
      return showError('Email invalid!');
    }

    if (!password) {
      return showError('Parolă este necesară!');
    }

    if (password.length < 6 || password.length > 123) {
      return showError('Parola trebuie să aibă între 6 și 12 caractere!');
    }

    if (isSignup) {
      const res = await fetch('/api/register/route', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const data = await res.json();
        return showError(data.message);
      }
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res.error) showError(res.error);
  };

  return (
    <div className={styles.container}>

      {/* ERROR POPUP */}
      {errorPopup && (
        <div className={styles.errorPopup}>
          {errorPopup}
        </div>
      )}

      <div className="text-center awesome text-primary text-4xl mb-6">
        {isForgotPassword ? 'Resetare Parolă' : isSignup ? 'Register' : 'Login'}
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />

      {!isForgotPassword && (
        <>
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </>
      )}

      {resetMessage && <p className={styles.success}>{resetMessage} Vei fi redirecționat...</p>}

      {!isForgotPassword ? (
        <>
          <button className={styles.continueButton} onClick={handleAuth}>
            {isSignup ? 'Înregistrează-te' : 'Continuă'}
          </button>

          <p className={styles.toggleText}>
  {isSignup ? 'Ai deja cont? ' : 'Nu ai cont? '}
  <span
    className={styles.toggleLink}
    onClick={() => {
      if (!isSignup) {
        // If user wants to register → redirect to /register
        router.push('/register');
        return;
      }

      // Otherwise switch back to login mode
      setIsSignup(false);
      setEmail('');
      setPassword('');
      setResetMessage('');
      setErrorPopup('');
      setIsForgotPassword(false);
    }}
  >
    {isSignup ? 'Intră în cont.' : 'Creează unul.'}
  </span>
</p>
        </>
      ) : (
        <>
          <button className={styles.continueButton} onClick={handleForgotPassword}>
            Trimite link-ul de resetare
          </button>
          <p className={styles.toggleText}>
            <span
              className={styles.toggleLink}
              onClick={() => {
                setIsForgotPassword(false);
                setEmail('');
                setPassword('');
                setResetMessage('');
              }}
            >
              ← Înapoi la autentificare
            </span>
          </p>
        </>
      )}

      {!isForgotPassword && (
        <>
          <div className={styles.separator}>
            <hr />
            <span>sau</span>
            <hr />
          </div>

          <button className={styles.googleButton} onClick={() => signIn('google')}>
            <img src="/google.png" alt="Google logo" className={styles.icon} />
            Google
          </button>
        </>
      )}
    </div>
  );
}




// default veersion

// 'use client';
// import {signIn} from "next-auth/react";
// import Image from "next/image";
// import {useState} from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginInProgress, setLoginInProgress] = useState(false);

//   async function handleFormSubmit(ev) {
//     ev.preventDefault();
//     setLoginInProgress(true);

//     await signIn('credentials', {email, password, callbackUrl: '/'});

//     setLoginInProgress(false);
//   }
//   return (
//     <section className="mt-8">
//       <h1 className="text-center text-primary text-4xl mb-4">
//         Login
//       </h1>
//       <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
//         <input type="email" name="email" placeholder="email" value={email}
//                disabled={loginInProgress}
//                onChange={ev => setEmail(ev.target.value)} />
//         <input type="password" name="password" placeholder="password" value={password}
//                disabled={loginInProgress}
//                onChange={ev => setPassword(ev.target.value)}/>
//         <button disabled={loginInProgress} type="submit">Login</button>
//         <div className="my-4 text-center text-gray-500">
//           or login with provider
//         </div>
//         <button type="button" onClick={() => signIn('google', {callbackUrl: '/'})}
//                 className="flex gap-4 justify-center">
//           <Image src={'/google.png'} alt={''} width={24} height={24} />
//           Login with google
//         </button>
//       </form>
//     </section>
//   );
// }
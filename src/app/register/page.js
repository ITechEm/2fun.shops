'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPopup, setErrorPopup] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showError = (message) => {
    setErrorPopup(message);
    setTimeout(() => setErrorPopup(''), 3000);
  };

  async function handleRegister() {
    if (!email || !password) {
      return showError('Email și parolă sunt necesare.');
    }

    if (password.length < 6 || password.length > 12) {
      return showError('Parola trebuie să aibă între 6 și 12 caractere!');
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setSuccessMessage('Cont creat cu succes! Redirecționare...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const data = await response.json();
      showError(data.message || 'A apărut o eroare.');
    }
  }

  return (
    <div className={styles.container}>
      {errorPopup && <div className={styles.errorPopup}>{errorPopup}</div>}

      <div className="text-center awesome text-primary text-4xl mb-6">
        Register
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />

      <input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />

      {successMessage && <p className={styles.success}>{successMessage}</p>}

      <button className={styles.continueButton} onClick={handleRegister}>
        Creează cont
      </button>

      <p className={styles.toggleText}>
        Ai deja cont?{' '}
        <span className={styles.toggleLink} onClick={() => router.push('/login')}>
          Intră în cont.
        </span>
      </p>

      <div className={styles.separator}>
        <hr />
        <span>sau</span>
        <hr />
      </div>

      <button className={styles.googleButton} onClick={() => signIn('google')}>
        <img src="/google.png" alt="Google logo" className={styles.icon} />
        Google
      </button>
    </div>
  );
}


// Defaul verison
// "use client";
// import {signIn} from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import {useState} from "react";

// export default function RegisterPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [creatingUser, setCreatingUser] = useState(false);
//   const [userCreated, setUserCreated] = useState(false);
//   const [error, setError] = useState(false);
//   async function handleFormSubmit(ev) {
//     ev.preventDefault();
//     setCreatingUser(true);
//     setError(false);
//     setUserCreated(false);
//     const response = await fetch('/api/register', {
//       method: 'POST',
//       body: JSON.stringify({email, password}),
//       headers: {'Content-Type': 'application/json'},
//     });
//     if (response.ok) {
//       setUserCreated(true);
//     }
//     else {
//       setError(true);
//     }
//     setCreatingUser(false);
//   }
//   return (
//     <section className="mt-8">
//       <h1 className="text-center text-primary text-4xl mb-4">
//         Register
//       </h1>
//       {userCreated && (
//         <div className="my-4 text-center">
//           User created.<br />
//           Now you can{' '}
//           <Link className="underline" href={'/login'}>Login &raquo;</Link>
//         </div>
//       )}
//       {error && (
//         <div className="my-4 text-center">
//           An error has occurred.<br />
//           Please try again later
//         </div>
//       )}
//       <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
//         <input type="email" placeholder="email" value={email}
//                disabled={creatingUser}
//                onChange={ev => setEmail(ev.target.value)} />
//         <input type="password" placeholder="password" value={password}
//                disabled={creatingUser}
//                 onChange={ev => setPassword(ev.target.value)}/>
//         <button type="submit" disabled={creatingUser}>
//           Register
//         </button>
//         <div className="my-4 text-center text-gray-500">
//           or login with provider
//         </div>
//         <button
//           onClick={() => signIn('google', {callbackUrl:'/'})}
//           className="flex gap-4 justify-center">
//           <Image src={'/google.png'} alt={''} width={24} height={24} />
//           Login with google
//         </button>
//         <div className="text-center my-4 text-gray-500 border-t pt-4">
//           Existing account?{' '}
//           <Link className="underline" href={'/login'}>Login here &raquo;</Link>
//         </div>
//       </form>
//     </section>
//   );
// }
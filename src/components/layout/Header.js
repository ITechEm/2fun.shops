'use client';
import {CartContext} from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useContext, useState} from "react";
import Image from 'next/image';

function Profile({status, userName}) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          <h1 className="text-black trimmedbutton">Hi, {userName}</h1>
        </Link>
      </>
    );
  }
}

function AuthLinks({status, userName}) {
  if (status === 'authenticated') {
    return (
      <>
        <button
          onClick={() => signOut()}>
          <img src="/logout.svg" alt="Logout" style={{ width: '25px', height: '25px' }} />
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <Link href="/login">
      <img src="/user.svg" alt="User" style={{ width: '25px', height: '25px' }} />
    </Link>   
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts} = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }
  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href={'/'}>
          <img src={'/logo.png'}  width={100} height={40} />
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <img src="/cart.svg" alt="Cart" style={{ width: '25px', height: '25px'}} />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1  leading-3">
            {cartProducts.length}
          </span>
            )}
          </Link>

          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4  mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Home</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#about'}>About</Link>
          <Link href={'/#contact'}>Contact</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8  font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={'/'}>
            <img src={'/logo.png'}  width={100} height={40} />
          </Link>
          <Link href="/shops" className="relative">
            Shops
            <span className="absolute -top-3 -right-5 text-[10px] bg-pink-500 text-white rounded-full px-1 py-0.5">HOT</span>
          </Link>
          <Link href={'/menu'}>Rent</Link>
          <Link href={'/#about'}>About</Link>
          <Link href={'/#contact'}>Contact</Link>
        </nav>
        <nav className="flex items-center gap-4 font-semibold">
          <Profile userName={userName} status={status} />
          <Link href={'/wishlist'} className="relative">
            <img src="/heart.svg" alt="Wishlist" style={{ width: '25px', height: '25px'}} />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
            {cartProducts.length}
          </span>
            )}
          </Link>
          <Link href={'/cart'} className="relative">
            <img src="/cart.svg" alt="Cart" style={{ width: '25px', height: '25px' }} />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
            {cartProducts.length}
          </span>
            )}
          </Link>
          <AuthLinks userName={userName} status={status} />
        </nav>
      </div>
    </header>
  );
}


'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import Image from "next/image";

export default function UserTabs({isAdmin}) {
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link
        className={path === '/profile' ? 'active' : ''}
        href={'/profile'}
      >
        <img src="/user.svg" alt="User" style={{ width: '25px', height: '25px' }} />
      </Link>
      <Link
        className={path === '/wishlist' ? 'active' : ''}
        href={'/wishlist'}
      >
        <img src="/heart.svg" alt="Wishlist" style={{ width: '25px', height: '25px'}} />
      </Link>
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            Categories
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Menu Items
          </Link>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            Users
          </Link>
        </>
      )}
      <Link
        className={path === '/orders' ? 'active' : ''}
        href={'/orders'}
      >
        <img src="/order.svg" alt="User" style={{ width: '25px', height: '25px' }} />
      </Link>
    </div>
  );
}
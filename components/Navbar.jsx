import { UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
const Navbar = () => {
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-extrabold tracking-wider">
                            Task<span className="text-yellow-400">Ai</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;

'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
            {user ? (
                <Link
                    href="/dashboard"
                    className="ml-4 text-sm text-gray-700 underline">
                    Admin Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="text-sm text-gray-700 underline">
                        Login (Admin)
                    </Link>

                    <Link
                        href="/register"
                        className="ml-4 text-sm text-gray-700 underline">
                        Register (Admin)
                    </Link>

                    <p className="mt-2 text-sm text-gray-700">
                        (These links would not be seen on a real production
                        version)
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                        (And register would be disabled)
                    </p>
                </>
            )}
        </div>
    )
}

export default LoginLinks

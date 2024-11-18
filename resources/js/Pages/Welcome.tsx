import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import './style.css'

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {

    return (
        <>
            <Head title="Welcome" />

            <div className="bg-slate-100 text-black/50 dark:bg-black dark:text-white/50" style={{ backgroundImage: 'url("/images/bg_main.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="w-full max-w-2xl px-6 lg:max-w-7xl">
                        <main className="flex items-center justify-between gap-3 w-full">
                            <h1 className="w-2/3 text-white font-extrabold text-3xl logo-text">SKP UNSIKA</h1>

                            <nav className="w-1/3  flex item-center justify-end gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-white p-3  px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md bg-white p-3  px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-white p-3  px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </main>

                        <footer className="absolute bottom-0 py-16 text-center text-sm text-yellow-500 dark:text-white/70">
                            SKP UNSIKA v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}

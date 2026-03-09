'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const updatePasswordSchema = z.object({
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
})

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
    const supabase = createClient()

    useEffect(() => {
        // Vérifie que l'utilisateur arrive bien via un lien de reset
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setIsValidSession(!!session)
        }
        checkSession()
    }, [supabase.auth])

    const { register, handleSubmit, formState: { errors } } = useForm<UpdatePasswordFormValues>({
        resolver: zodResolver(updatePasswordSchema),
    })

    const onSubmit = async (data: UpdatePasswordFormValues) => {
        setIsLoading(true)
        setError(null)

        const { error: updateError } = await supabase.auth.updateUser({
            password: data.password,
        })

        if (updateError) {
            setError(updateError.message)
            setIsLoading(false)
            return
        }

        setIsSuccess(true)
        setIsLoading(false)

        // Rediriger vers login après 3 secondes
        setTimeout(() => router.push('/login'), 3000)
    }

    // Session invalide (lien expiré ou accès direct)
    if (isValidSession === false) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-10 shadow-lg border border-gray-100 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Lien invalide ou expiré</h2>
                    <p className="text-sm text-gray-600">
                        Ce lien de réinitialisation est expiré ou invalide. Veuillez refaire une demande.
                    </p>
                    <Link
                        href="/reset-password"
                        className="inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Refaire une demande
                    </Link>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-10 shadow-lg border border-gray-100 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Mot de passe mis à jour !</h2>
                    <p className="text-sm text-gray-600">
                        Votre mot de passe a été changé avec succès. Vous allez être redirigé vers la connexion...
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Se connecter maintenant
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[#0D9488]">Nouveau mot de passe</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Choisissez un mot de passe fort d&apos;au moins 8 caractères
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                {...register('password')}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirm_password"
                                type="password"
                                autoComplete="new-password"
                                {...register('confirm_password')}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                                placeholder="••••••••"
                            />
                            {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isValidSession === null}
                        className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                    </button>
                </form>
            </div>
        </div>
    )
}

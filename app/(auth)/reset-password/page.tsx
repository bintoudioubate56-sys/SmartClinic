'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const resetSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema)
  })

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true)
    setError(null)

    // L'URL de redirection doit de préférence pointer vers une page spéciale de mise à jour du mot de passe une fois le lien cliqué
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#0D9488]">Mot de passe oublié</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nous allons vous envoyer un lien pour réinitialiser votre mot de passe
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 space-y-6">
            <div className="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-700 text-center">
              Si un compte est associé à cette adresse e-mail, vous recevrez un lien de réinitialisation d&apos;ici quelques minutes.
            </div>
            <div className="text-center pt-4">
              <Link href="/login" className="font-medium text-[#0D9488] hover:text-teal-700">
                Retour à la connexion
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </button>
            </div>
            
            <div className="text-center text-sm border-t pt-6 mt-6">
              <Link href="/login" className="font-medium text-gray-600 hover:text-gray-900">
                Annuler
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

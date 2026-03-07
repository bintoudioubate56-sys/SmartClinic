'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { registerPatientAction } from '@/app/actions/auth'
import Link from 'next/link'

const registerClientSchema = z.object({
  first_name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  last_name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  confirm_password: z.string(),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la politique de confidentialité",
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
})

type RegisterFormValues = z.infer<typeof registerClientSchema>

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerClientSchema),
    mode: 'onTouched'
  })

  // Permet de passer à l'étape suivante après validation des premiers champs
  const goNextStep = async () => {
    const isStepValid = await trigger(['first_name', 'last_name', 'email', 'password', 'confirm_password'])
    if (isStepValid) {
      setStep(2)
    }
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('first_name', data.first_name)
    formData.append('last_name', data.last_name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('consent_given', data.consent_given ? 'true' : 'false')

    const result = await registerPatientAction(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsSuccess(true)
      setIsLoading(false)
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Inscription réussie !</h2>
          <p className="text-sm text-gray-600">
            Votre compte patient a été créé avec succès. Un e-mail de confirmation vient de vous être envoyé.
          </p>
          <div className="pt-4">
            <Link href="/login" className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] px-4 py-2 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 sm:text-sm">
              Aller à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#0D9488]">Inscription Patient</h2>
          <p className="mt-2 text-sm text-gray-600">
            Étape {step} sur 2
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    id="first_name"
                    type="text"
                    {...register('first_name')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                  {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    id="last_name"
                    type="text"
                    {...register('last_name')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                  {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <input
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirm_password')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                />
                {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={goNextStep}
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Consentement RGPD</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        En créant un compte, vous acceptez que vos données personnelles et médicales soient stockées et traitées par SmartClinic afin de gérer vos rendez-vous et votre dossier médical.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="consent_given"
                    type="checkbox"
                    {...register('consent_given')}
                    className="h-4 w-4 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consent_given" className="font-medium text-gray-700">
                    J&apos;accepte la politique de confidentialité et le traitement de mes données
                  </label>
                  {errors.consent_given && <p className="mt-1 text-xs text-red-500">{errors.consent_given.message}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Création..." : "Terminer l'inscription"}
                </button>
              </div>
            </div>
          )}
        </form>
        
        <div className="text-center text-sm border-t pt-6 mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-[#0D9488] hover:text-teal-700">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

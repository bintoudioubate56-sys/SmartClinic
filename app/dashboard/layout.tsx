import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default async function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Récupérer le profil de l'utilisateur
    const { data: profile } = await supabase
        .from('users')
        .select('role, nom, clinique_id')
        .eq('id', user.id)
        .single()

    if (!profile?.role) {
        redirect('/login')
    }

    // Récupérer le nom de la clinique si applicable
    let clinique: { nom: string } | undefined
    if (profile.clinique_id) {
        const { data: clinic } = await supabase
            .from('clinics')
            .select('nom')
            .eq('id', profile.clinique_id)
            .single()
        if (clinic) {
            clinique = { nom: clinic.nom }
        }
    }

    const userData = {
        nom: profile.nom || 'Utilisateur',
        role: profile.role,
        clinique: clinique
    }

    return (
        <DashboardLayout user={userData}>
            {children}
        </DashboardLayout>
    )
}

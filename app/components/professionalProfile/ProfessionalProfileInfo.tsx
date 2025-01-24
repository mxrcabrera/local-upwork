'use client'

import { fetchProfessionalInfo } from "@/app/libs/firebase/auth"
import { ProfessionalProfile } from "@/app/utils/types"
import { useEffect, useState } from "react"

export default function ProfessionalProfileInfo({ uid }: { uid: string }) {
    const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProfessionalInfo(uid)
                setProfessionalProfile(data)
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [uid])

    if (loading) {
        return <div className="text-gray-500">Cargando perfil...</div>
    }

    if (!professionalProfile) {
        return <div className="text-gray-500">Perfil profesional no encontrado</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
            {/* Sección Principal */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Tu perfil prof
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-500">
                            {typeof professionalProfile.rating === 'number' ?
                                '★'.repeat(professionalProfile.rating) : 'Sin calificaciones'}
                        </span>
                        {professionalProfile.verifiedPremium && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Premium
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 mb-4">
                        {professionalProfile.biography || 'Profesional dedicado con experiencia en su campo'}
                    </p>
                </div>
            </div>

            {/* Habilidades y Servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                        {professionalProfile.skills.map((skill: string, index: number) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Servicios Ofrecidos</h3>
                    <div className="flex flex-wrap gap-2">
                        {professionalProfile.offeredServices.map((service: string, index: number) => (
                            <span
                                key={index}
                                className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                            >
                                {service}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disponibilidad */}
            <div className="mt-6">
                <h3 className="font-semibold mb-3">Disponibilidad</h3>
                <div className="text-gray-600">
                    {professionalProfile.availability?.length > 0
                        ? 'Horarios flexibles - Consultar disponibilidad'
                        : 'No disponible actualmente'}
                </div>
            </div>
        </div>
    )
}
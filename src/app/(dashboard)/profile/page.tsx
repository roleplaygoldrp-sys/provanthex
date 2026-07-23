'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, User, Mail, Building, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  company: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserProfile {
  id: string
  email: string
  name: string | null
  company: string | null
  plan: string
  credits: number
  subscriptionStatus: string
  proExpiresAt: string | null
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/me')
      const data = await response.json()
      
      if (data.user) {
        setProfile(data.user)
        reset({
          name: data.user.name || '',
          company: data.user.company || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          title: 'Erro',
          description: result.error || 'Não foi possível atualizar o perfil',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      })

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  const isPro = profile?.plan === 'PRO' && profile?.subscriptionStatus === 'ACTIVE'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Perfil</h1>
        <p className="text-slate-400 mt-1">Gerencie suas informações pessoais</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription className="text-slate-400">
            Atualize suas informações de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="name"
                  placeholder="Seu nome"
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="pl-10 bg-slate-800/50 border-slate-700 text-slate-400"
                />
              </div>
              <p className="text-xs text-slate-500">O email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-300">Empresa (opcional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="company"
                  placeholder="Sua empresa"
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  {...register('company')}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Plano e Assinatura</CardTitle>
          <CardDescription className="text-slate-400">
            Informações sobre seu plano atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Plano Atual</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-white">
                  {isPro ? 'Plano Pro' : 'Plano Free'}
                </span>
                {isPro ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    ATIVO
                  </Badge>
                ) : (
                  <Badge variant="secondary">FREE</Badge>
                )}
              </div>
            </div>
            
            {!isPro && (
              <Button 
                onClick={() => router.push('/billing')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Upgrade para Pro
              </Button>
            )}
          </div>

          <Separator className="bg-slate-800" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Créditos Disponíveis</p>
              <p className="text-2xl font-bold text-white">{profile?.credits || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Membro desde</p>
              <p className="text-2xl font-bold text-white">
                {profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
                  : '-'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

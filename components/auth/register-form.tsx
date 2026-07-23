'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  company: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          title: 'Erro ao criar conta',
          description: result.error || 'Tente novamente',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Conta criada!',
        description: 'Bem-vindo à Vanthex IA. Faça login para continuar.',
        variant: 'default',
      })

      router.push('/login')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar sua conta',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
        <CardDescription className="text-slate-400">
          Comece gratuitamente com 50 mensagens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Nome</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-300">Empresa (opcional)</Label>
            <Input
              id="company"
              placeholder="Sua empresa"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              {...register('company')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

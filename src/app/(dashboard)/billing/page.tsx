'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CreditCard, Check, X, Sparkles, Crown, AlertTriangle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface UserSubscription {
  id: string
  email: string
  name: string | null
  plan: string
  credits: number
  subscriptionStatus: string
  proExpiresAt: string | null
  createdAt: string
}

export default function BillingPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchSubscription()
    }
  }, [status, router])

  useEffect(() => {
    if (success) {
      toast({
        title: 'Pagamento realizado!',
        description: 'Bem-vindo ao plano Pro!',
        variant: 'default',
      })
      fetchSubscription()
    }
    if (canceled) {
      toast({
        title: 'Pagamento cancelado',
        description: 'O pagamento foi cancelado. Tente novamente.',
        variant: 'destructive',
      })
    }
  }, [success, canceled])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/users/me')
      const data = await response.json()
      
      if (data.user) {
        setSubscription(data.user)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setIsLoadingSubscription(false)
    }
  }

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Erro',
          description: data.error || 'Não foi possível processar o pagamento',
          variant: 'destructive',
        })
        return
      }

      // Redirect to Stripe
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso ao plano Pro.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Erro',
          description: data.error || 'Não foi possível cancelar',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Assinatura cancelada',
        description: 'Você voltou ao plano Free.',
      })

      // Update session
      await update()
      fetchSubscription()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao cancelar',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  const isPro = subscription?.plan === 'PRO' && subscription?.subscriptionStatus === 'ACTIVE'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Assinatura</h1>
        <p className="text-slate-400 mt-1">Gerencie seu plano e assinatura</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">
                  {isPro ? 'Plano Pro' : 'Plano Free'}
                </span>
                {isPro ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    ATIVO
                  </Badge>
                ) : (
                  <Badge variant="secondary">GRATIS</Badge>
                )}
              </div>
              {isPro && subscription?.proExpiresAt && (
                <p className="text-sm text-slate-400 mt-2">
                  Expira em: {new Date(subscription.proExpiresAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            {isPro ? (
              <Button 
                variant="outline" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Cancelar Assinatura
              </Button>
            ) : (
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Crown className="w-4 h-4 mr-2" />}
                Upgrade para Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <Tabs defaultValue={isPro ? 'pro' : 'free'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="free" className="text-slate-300">Plano Free</TabsTrigger>
          <TabsTrigger value="pro" className="text-slate-300">Plano Pro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="free" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">Plano Free</CardTitle>
                  <p className="text-3xl font-bold text-white mt-2">R$ 0<span className="text-lg font-normal text-slate-400">/mês</span></p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">Atual</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-400" />
                  50 mensagens por mês
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-400" />
                  Consultor Geral de IA
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-400" />
                  Respostas básicas
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-400" />
                  Histórico de 7 dias
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <X className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-500">Especialistas avançados</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <X className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-500">Respostas detalhadas</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pro" className="mt-6">
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-pink-400" />
                    Plano Pro
                  </CardTitle>
                  <p className="text-3xl font-bold text-white mt-2">R$ 97<span className="text-lg font-normal text-slate-400">/mês</span></p>
                </div>
                {isPro && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Seu Plano</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-pink-400" />
                  <strong>Mensagens ilimitadas</strong>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-pink-400" />
                  <strong>8 Especialistas</strong> disponíveis
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-pink-400" />
                  Respostas detalhadas
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-pink-400" />
                  Histórico ilimitado
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-pink-400" />
                  Suporte prioritário
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-pink-400" />
                  Acesso antecipado a novos recursos
                </li>
              </ul>
              
              {!isPro && (
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Crown className="w-4 h-4 mr-2" />}
                  Assinar Plano Pro
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Posso cancelar a qualquer momento?</h4>
            <p className="text-sm text-slate-400">Sim, você pode cancelar sua assinatura a qualquer momento. O acesso continuará até o final do período pago.</p>
          </div>
          <Separator className="bg-slate-800" />
          <div>
            <h4 className="font-medium text-white mb-2">Quais formas de pagamento são aceitas?</h4>
            <p className="text-sm text-slate-400">Aceitamos todos os cartões de crédito principais (Visa, Mastercard, American Express) e Pix.</p>
          </div>
          <Separator className="bg-slate-800" />
          <div>
            <h4 className="font-medium text-white mb-2">O que acontece quando os créditos do plano Free terminam?</h4>
            <p className="text-sm text-slate-400">Você pode esperar até o próximo mês para receber novos créditos ou fazer upgrade para o plano Pro.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  // Get user data with credits and plan
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      credits: true,
      plan: true,
      subscriptionStatus: true,
      proExpiresAt: true,
      _count: {
        select: {
          conversations: true,
        }
      }
    }
  })

  // Get recent conversations
  const recentConversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      specialist: true,
      _count: {
        select: { messages: true }
      }
    }
  })

  const isPro = user?.plan === 'PRO' && user?.subscriptionStatus === 'ACTIVE'

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">Olá, {session.user.name || 'bem-vindo'}!</h1>
        <p className="text-slate-400 mt-1">Como posso ajudar você hoje?</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Plano Atual
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isPro ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">PRO</Badge>
              ) : (
                <Badge variant="secondary">FREE</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isPro ? 'Acesso completo' : `${user?.credits || 0} mensagens restantes`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Conversas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{user?._count.conversations || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Total de conversas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Especialistas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-slate-500 mt-1">
              {isPro ? 'Todos disponíveis' : '1 disponível'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Última conversa
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {recentConversations.length > 0 ? 'Hoje' : '-'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {recentConversations.length > 0 
                ? new Date(recentConversations[0].updatedAt).toLocaleDateString('pt-BR')
                : 'Nenhuma conversa'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Nova Conversa
            </CardTitle>
            <CardDescription className="text-slate-400">
              Tire dúvidas, peça análises ou crie estratégias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Iniciar Conversa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {!isPro && (
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-400" />
                Upgrade para Pro
              </CardTitle>
              <CardDescription className="text-slate-300">
                Tenha acesso a todos os especialistas e respostas detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/billing">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Ver Planos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Conversations */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Conversas Recentes</CardTitle>
          <CardDescription className="text-slate-400">
            Suas conversas anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Nenhuma conversa ainda</p>
              <Link href="/chat">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Iniciar primeira conversa
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conversation) => (
                <Link 
                  key={conversation.id} 
                  href={`/chat/${conversation.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{conversation.specialist?.icon || '🎯'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {conversation.title || 'Nova conversa'}
                      </p>
                      <p className="text-sm text-slate-400">
                        {conversation._count.messages} mensagens
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">
                      {new Date(conversation.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

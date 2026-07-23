import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Navigation */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Vanthex <span className="text-purple-400">IA</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors">Recursos</Link>
              <Link href="#specialists" className="text-slate-300 hover:text-white transition-colors">Especialistas</Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">Planos</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950/0 to-slate-950/0" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Especializada para Mercado Digital
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Sua Consultora de IA
              <span className="block text-gradient">24/7</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Tire dúvidas, analise problemas e crie estratégias com uma IA especializada 
              em mercado digital. Economize tempo e tome decisões maisassertivas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#specialists">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg">
                  Conhecer Especialistas
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-slate-400 mt-4">
              50 mensagensGRÁTIS no plano Free • Sem cartão de crédito
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-slate-400 text-sm">Mensagens Grátis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">8</div>
              <div className="text-slate-400 text-sm">Especialistas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-slate-400 text-sm">Disponível</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">R$ 97</div>
              <div className="text-slate-400 text-sm">Plano Pro</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que escolher a Vanthex IA?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Uma ferramenta completa para profissionais do mercado digital
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">IA Especializada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Especialistas em diferentes áreas do mercado digital, desde tráfego pago até infoprodutos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="text-white">Conversa Natural</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Interface de chat intuitiva e poderosa. Tire dúvidas como se estivesse conversando com um especialista.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Respostas Imediatas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Não espere. Receba análises e estratégias em segundos, a qualquer hora do dia.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Estratégias Práticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Receba recomendações acionáveis para aumentar seus resultados immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white">Dados Seguros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Suas conversas e dados são criptografados e protegidos com os mais altos padrões.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Para Todos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Ideal para gestores de tráfego, agências, infoprodutores, e-commerces e afiliados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section id="specialists" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nossos Especialistas
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Escolha o especialista mais adequado para sua necessidade no plano Pro
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">🎯</div>
                <CardTitle className="text-white">Consultor Geral</CardTitle>
                <CardDescription className="text-slate-400">
                  Marketing digital geral
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Estratégias gerais, tendências e dúvidas sobre o mercado digital.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">📈</div>
                <CardTitle className="text-white">Tráfego Pago</CardTitle>
                <CardDescription className="text-slate-400">
                  Google, Meta, TikTok Ads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Otimização de campanhas, redução de CAC e aumento de ROAS.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">✍️</div>
                <CardTitle className="text-white">Copywriting</CardTitle>
                <CardDescription className="text-slate-400">
                  Textos persuasivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Criação de textos para vendas, anúncios e e-mail marketing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">🛒</div>
                <CardTitle className="text-white">E-commerce</CardTitle>
                <CardDescription className="text-slate-400">
                  Lojas virtuais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Shopify, WooCommerce, conversão e logística.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">💰</div>
                <CardTitle className="text-white">Afiliados</CardTitle>
                <CardDescription className="text-slate-400">
                  Marketing de afiliados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Escolha de produtos, estratégias de tráfego e monetização.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">📚</div>
                <CardTitle className="text-white">Infoprodutos</CardTitle>
                <CardDescription className="text-slate-400">
                  Cursos e produtos digitais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Criação de cursos, mentorias e lançamento de produtos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">🔍</div>
                <CardTitle className="text-white">SEO</CardTitle>
                <CardDescription className="text-slate-400">
                  Search Engine Optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Otimização para Google,排名 e tráfego orgânico.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">⚙️</div>
                <CardTitle className="text-white">Automação</CardTitle>
                <CardDescription className="text-slate-400">
                  Zapier, Make, RD Station
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Automação de marketing e integração de ferramentas.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-slate-400 mt-8">
            * Apenas no plano Pro
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Planos Simples
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comece gratuitamente e faça upgrade quando precisar de mais recursos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white">Plano Free</CardTitle>
                <div className="text-4xl font-bold text-white mt-4">R$ 0</div>
                <CardDescription className="text-slate-400">Para testar e usar no dia a dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    50 mensagens por mês
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Consultor Geral de IA
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Respostas básicas
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Histórico de 7 dias
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Suporte por e-mail
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full mt-8 bg-slate-700 hover:bg-slate-600 text-white">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Mais Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white">Plano Pro</CardTitle>
                <div className="text-4xl font-bold text-white mt-4">R$ 97<span className="text-lg font-normal text-slate-400">/mês</span></div>
                <CardDescription className="text-slate-300">Para profissionais que levam a sério</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    Mensagens ilimitadas
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    <strong>8 Especialistas</strong> disponíveis
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    Respostas detalhadas
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    Histórico ilimitado
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    Suporte prioritário
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Assinar Plano Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para transformar seu negócio?
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                Junte-se a milhares de profissionais que já usam a Vanthex IA para 
                tomar decisões mais assertivas e economizar tempo.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Vanthex <span className="text-purple-400">IA</span></span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 Vanthex IA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

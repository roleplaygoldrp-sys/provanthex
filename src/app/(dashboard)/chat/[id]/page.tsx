'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowLeft, 
  Send, 
  Trash2, 
  Loader2,
  Sparkles,
  Brain,
  MessageSquare
} from 'lucide-react'

interface Specialist {
  id: string
  name: string
  slug: string
  icon: string
  category: string
}

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
}

export default function ChatConversationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('')
  const [detailLevel, setDetailLevel] = useState<'BASIC' | 'DETAILED'>('BASIC')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoadingConversation, setIsLoadingConversation] = useState(true)

  const conversationIdFromParams = params.id as string

  // Fetch specialists
  useEffect(() => {
    fetch('/api/specialists')
      .then(res => res.json())
      .then(data => {
        setSpecialists(data.specialists || [])
      })
  }, [])

  // Load conversation if ID provided
  useEffect(() => {
    if (conversationIdFromParams && conversationIdFromParams !== 'new') {
      setIsLoadingConversation(true)
      fetch(`/api/conversations/${conversationIdFromParams}`)
        .then(res => res.json())
        .then(data => {
          if (data.conversation) {
            setConversationId(data.conversation.id)
            setMessages(data.conversation.messages || [])
            if (data.conversation.specialist) {
              setSelectedSpecialist(data.conversation.specialist.id)
            }
            setDetailLevel(data.conversation.detailLevel || 'BASIC')
          }
        })
        .finally(() => setIsLoadingConversation(false))
    } else {
      setIsLoadingConversation(false)
    }
  }, [conversationIdFromParams])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content: inputMessage,
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: inputMessage,
          specialistId: selectedSpecialist,
          detailLevel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'ASSISTANT',
            content: 'Você atingiu o limite de mensagens do plano gratuito. Faça upgrade para o plano Pro para continuar usando.',
            createdAt: new Date().toISOString(),
          }])
        }
        return
      }

      if (data.conversation?.id) {
        setConversationId(data.conversation.id)
        if (!conversationId) {
          router.replace(`/chat/${data.conversation.id}`)
        }
      }

      if (data.conversation?.credits !== undefined && data.conversation?.credits !== null) {
        setCredits(data.conversation.credits)
      }

      setMessages(prev => [...prev, {
        id: data.message.id,
        role: 'ASSISTANT',
        content: data.message.content,
        createdAt: data.message.createdAt,
      }])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = async () => {
    if (!conversationId) return
    
    if (!confirm('Tem certeza que deseja excluir esta conversa?')) return

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (status === 'loading' || isLoadingConversation) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Conversa</h1>
            <p className="text-sm text-slate-400">Continue sua conversa com a IA</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {credits !== null && (
            <Badge variant={credits > 10 ? 'secondary' : 'destructive'}>
              {credits} créditos restantes
            </Badge>
          )}
          
          {conversationId && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={deleteConversation}
              className="text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col overflow-hidden">
        {/* Chat Settings */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">Especialista:</span>
            <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {specialists.map(specialist => (
                  <SelectItem 
                    key={specialist.id} 
                    value={specialist.id}
                    className="text-white focus:bg-slate-700"
                  >
                    <span className="mr-2">{specialist.icon}</span>
                    {specialist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-slate-400">Nível:</span>
            <Select value={detailLevel} onValueChange={(v) => setDetailLevel(v as 'BASIC' | 'DETAILED')}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="BASIC" className="text-white focus:bg-slate-700">
                  Básico
                </SelectItem>
                <SelectItem value="DETAILED" className="text-white focus:bg-slate-700">
                  Detalhado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Como posso ajudar?</h3>
              <p className="text-slate-400 max-w-md">
                Tire dúvidas sobre marketing digital, peça análises de campanhas, 
                crie estratégias ou peça ajuda com copywriting.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'USER' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.role === 'USER' ? 'bg-blue-600' : 'bg-purple-600'}>
                    {message.role === 'USER' ? 'U' : 'V'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'USER' 
                      ? 'bg-blue-600/20 text-white' 
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-600">V</AvatarFallback>
              </Avatar>
              <div className="bg-slate-800 rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

# 🚢 Batalha Naval - Multiplayer WLAN

Um jogo de Batalha Naval desenvolvido em React Native (Expo) para Android/iOS com suporte multiplayer na mesma rede WLAN.

## 📋 Características Implementadas

### ✅ Interface do Jogo
- **Tela de Lobby**: Entrada dos nomes dos jogadores e início do jogo
- **Tela de Setup**: Colocação dos navios no tabuleiro (10x10)
- **Tela de Jogo**: Visualização dos dois tabuleiros (Meu Oceano e Radar Inimigo)
- **Tela de Resultado**: Estatísticas do jogo e opção de nova partida

### ✅ Mecânicas do Jogo
- Tabuleiro 10×10 com coordenadas (A-J, 1-10)
- Frota clássica de 5 navios:
  - Porta-aviões: 5 células
  - Cruzador: 4 células
  - Contratorpedeiro: 3 células
  - Submarino: 3 células
  - Patrulha: 2 células

### ✅ Regras Implementadas
- ✅ Colocação de navios com validação:
  - Não podem sobrepor
  - Não podem encostar (nem lado a lado, nem diagonal)
- ✅ Colocação aleatória de navios
- ✅ Alternância de turnos entre jogadores
- ✅ Feedback de tiros:
  - 💦 Água (nenhum navio)
  - 💥 Acerto (atingiu navio)
  - 🔥 Afundado (todas células do navio atingidas)
- ✅ Detecção de fim de jogo
- ✅ Estatísticas detalhadas do vencedor

## 🎮 Como Jogar

### Modo Atual (Local - Mesmo Dispositivo)
1. Inicie a aplicação
2. Insira os nomes dos dois jogadores
3. Cada jogador coloca seus navios (use "Colocação Aleatória" para rapidez)
4. Quando ambos estiverem prontos, o jogo começa
5. Cada jogador dispara alternadamente no tabuleiro inimigo
6. O primeiro a afundar todos os navios do adversário vence!

### Modo Multiplayer WLAN (Em Desenvolvimento)
Para jogar em rede local:
1. Conecte ambos os dispositivos à mesma rede WiFi (recomendado: hotspot)
2. Um jogador cria a sala de jogo
3. O outro jogador entra com o código da sala
4. Ambos colocam seus navios
5. O jogo sincroniza as ações entre os dispositivos

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (v14 ou superior)
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Dispositivo Android/iOS ou emulador

### Instalação
```bash
cd batalha-naval
npm install
```

### Executar
```bash
# Iniciar servidor Expo
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web (limitado)
npm run web
```

## 📁 Estrutura do Projeto

```
batalha-naval/
├── App.tsx                      # Componente principal com navegação
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Board.tsx           # Tabuleiro do jogo
│   │   ├── Cell.tsx            # Célula individual
│   │   └── ...
│   ├── context/                # Contextos React
│   │   └── GameContext.tsx     # Estado global do jogo
│   ├── models/                 # Tipos TypeScript
│   │   ├── Board.ts
│   │   ├── Cell.ts
│   │   ├── Ship.ts
│   │   ├── Player.ts
│   │   └── GameState.ts
│   ├── screens/                # Telas do jogo
│   │   ├── LobbyScreen.tsx     # Tela inicial
│   │   ├── SetupScreen.tsx     # Colocação de navios
│   │   ├── GameScreen.tsx      # Jogo principal
│   │   └── ResultScreen.tsx    # Resultados
│   ├── services/               # Lógica de negócio
│   │   ├── gameLogic.ts        # Regras do jogo
│   │   ├── shipPlacement.ts    # Colocação de navios
│   │   └── network.ts          # Comunicação de rede
│   └── utils/                  # Utilitários
│       ├── constants.ts
│       ├── boardHelpers.ts
│       └── random.ts
```

## 🔧 Tecnologias Utilizadas

- **React Native**: Framework mobile
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Tipagem estática
- **React Context API**: Gerenciamento de estado

## 🌐 Networking (Em Desenvolvimento)

Para implementar o multiplayer em rede WLAN, serão necessários:

### Pacotes Adicionais
```bash
npm install react-native-udp react-native-tcp
```

### Funcionalidades Planejadas
- ✅ Estrutura de serviço de rede implementada
- ⏳ Descoberta de jogadores via UDP broadcast
- ⏳ Criação e entrada em salas de jogo
- ⏳ Sincronização de estado entre dispositivos
- ⏳ Comunicação em tempo real durante o jogo

### Configuração de Rede Recomendada
Para melhor funcionamento do multiplayer:
1. Use um hotspot móvel criado num telemóvel
2. Conecte ambos os dispositivos ao mesmo hotspot
3. Certifique-se que não há firewall bloqueando as portas

## 🎨 Paleta de Cores

- Fundo: `#1a1a2e` (Azul escuro)
- Secundário: `#16213e` (Azul médio)
- Destaque: `#4da6ff` (Azul claro)
- Água: `#4da6ff`
- Água atingida: `#e0e0e0`
- Navio: `#666`
- Acerto: `#ff4d4d`

## 📝 Próximos Passos

1. Implementar comunicação UDP/TCP para multiplayer real
2. Adicionar animações e efeitos sonoros
3. Implementar arrastar e rodar navios manualmente
4. Adicionar modo contra bot (IA)
5. Criar sistema de estatísticas persistente
6. Adicionar opções de configuração (tema claro/escuro, vibração)

## 🐛 Problemas Conhecidos

- O multiplayer em rede ainda não está completamente implementado
- A colocação manual de navios (arrastar) ainda não está disponível
- Falta implementar efeitos sonoros

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👥 Autores

Desenvolvido como projeto para PDM (Programação de Dispositivos Móveis).

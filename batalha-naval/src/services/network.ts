/**
 * Serviço base de rede.
 * Aqui será implementada a comunicação WLAN (UDP/TCP).
 * Por agora serve como interface e documentação.
 */

export interface NetworkMessage {
  type: string;
  payload: any;
}

export function sendMessage(message: NetworkMessage) {
  // FUTURO: enviar pela rede local
  console.log('Enviar mensagem:', message);
}

export function onMessage(callback: (msg: NetworkMessage) => void) {
  // FUTURO: receber mensagens da rede
  console.log('Listener de mensagens registado');
}

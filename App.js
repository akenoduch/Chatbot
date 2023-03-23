import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import axios from 'axios';

const CHATGPT_API_KEY = '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';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  let messageCount = 0;


  useEffect(() => {
    // Função para enviar a mensagem para a API do ChatGPT
    const sendMessageToChatGPT = async () => {
      try {
        console.log('Enviando mensagem para o ChatGPT:', inputMessage);

        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt: `Você: ${inputMessage}\nChatGPT: `,
            max_tokens: 500,
            temperature: 0.7,
            n: 1,
            stop: '\n'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CHATGPT_API_KEY}`
            }
          }
        );

        console.log('Resposta recebida do ChatGPT:', response.data.choices[0].text.trim());

        const message = {
          id: `${Date.now().toString()}-${messageCount}`,
          text: inputMessage,
          isUserMessage: true
        };

        const chatGPTMessage = {
          id: `${Date.now().toString()}-${messageCount + 1}`,
          text: response.data.choices[0].text.trim(),
          isUserMessage: false
        };

        messageCount += 2;

        console.log('Mensagens a serem adicionadas:', [message, chatGPTMessage]);

        setMessages((messages) => [...messages, message, chatGPTMessage]);
        setInputValue('');

      } catch (error) {
        console.error('Erro ao enviar mensagem para o ChatGPT:', error);
      }
    };

    if (inputMessage && inputMessage.trim().length > 0) {
      sendMessageToChatGPT();
    }
  }, [inputMessage]);

  console.log('Mensagens exibidas na tela:', messages);

  return (
    <View style={styles.container} platform="ios">
      <View style={styles.messageList}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUserMessage ? styles.userMessageBubble : styles.chatGPTMessageBubble
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.input}
          placeholder="Digite sua mensagem"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          title="Enviar"
          onPress={() => {
            setInputMessage(inputValue.trim());
            setInputValue('');
          }}
          
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5
  },
  userMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff'
  },
  chatGPTMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'purple'
  },
  messageText: {
    color: '#fff'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  buttonContainer: {
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007aff',
    borderRadius: 5
  }
});
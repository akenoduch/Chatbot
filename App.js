import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import axios from 'axios';

const CHATGPT_API_KEY = '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';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Função para enviar a mensagem para a API do ChatGPT
    const sendMessageToChatGPT = async () => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt: `Você: ${inputMessage}\nChatGPT: `,
            max_tokens: 50,
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
        
        const message = {
          id: Date.now().toString(),
          text: inputMessage,
          isUserMessage: true
        };
        
        const chatGPTMessage = {
          id: Date.now().toString(),
          text: response.data.choices[0].text.trim(),
          isUserMessage: false
        };
        
        setMessages((messages) => [...messages, message, chatGPTMessage]);
        setInputMessage('');
      } catch (error) {
        console.error(error);
      }
    };
    
    if (inputMessage && inputMessage.trim().length > 0) {
      sendMessageToChatGPT();
    }
  }, [inputMessage]);

  return (
    <View style={styles.container} platform="ios">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <ListItem
            containerStyle={[
              styles.messageBubble,
              item.isUserMessage ? styles.userMessageBubble : styles.chatGPTMessageBubble
            ]}
            title={item.text}
            titleStyle={styles.messageText}
          />
        )}
        keyExtractor={(item, index) => item.id + index}
      />
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.input}
          placeholder="Digite sua mensagem"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          title="Enviar"
          onPress={() => setInputMessage(inputMessage.trim())}
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
    backgroundColor: '#e5e5ea'
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
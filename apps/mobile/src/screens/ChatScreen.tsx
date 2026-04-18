import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'https://riverbank-coeditor-overcrowd.ngrok-free.dev';

export default function ChatScreen({ route }: any) {
    const { channelId, channelName, userId, token } = route.params;
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Load message history
        fetch(`${SERVER_URL}/messages/${channelId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                console.log('Message history response:', JSON.stringify(data));
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error('Unexpected message history response:', data);
                }
            })
            .catch(err => console.error('Failed to load messages:', err));

        // Connect to Socket.io
        const socket = io(SERVER_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('joinChannel', channelId);
        });

        socket.on('newMessage', (message) => {
            setMessages(prev => Array.isArray(prev) ? [...prev, message] : [message]);
        });

        return () => {
            socket.emit('leaveChannel', channelId);
            socket.disconnect();
        };
    }, [channelId]);

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;
        socketRef.current.emit('sendMessage', {
            channelId,
            userId,
            content: input.trim(),
        });
        setInput('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                renderItem={({ item }) => {
                    const isOwnMessage = item.userId === userId;
                    return (
                        <View style={[
                            styles.messageBubble,
                            isOwnMessage ? styles.ownBubble : styles.otherBubble,
                        ]}>
                            {!isOwnMessage && (
                                <Text style={styles.username}>{item.username}</Text>
                            )}
                            <Text style={[
                                styles.messageText,
                                isOwnMessage && styles.ownMessageText,
                            ]}>
                                {item.content}
                            </Text>
                        </View>
                    );
                }}
            />
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messageList: {
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 3,
        borderRadius: 12,
    },
    ownBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#5895d3',
    },
    otherBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#e8f0fe',
    },
    username: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5895d3',
        marginBottom: 2,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    ownMessageText: {
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 10,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#5895d3',
        borderRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

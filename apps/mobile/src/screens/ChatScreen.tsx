import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';

export default function ChatScreen({ route }: any) {
    const { channelId, channelName, userId, token } = route.params;
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const theme = useTheme();

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
            style={[styles.container, { backgroundColor: theme.colors.surface.default }]}
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
                            isOwnMessage
                                ? [styles.ownBubble, { backgroundColor: theme.colors.primary[500] }]
                                : [styles.otherBubble, { backgroundColor: theme.colors.neutral[100] }],
                        ]}>
                            {!isOwnMessage && (
                                <Text style={[styles.username, { color: theme.colors.primary[600] }]}>
                                    {item.username}
                                </Text>
                            )}
                            <Text style={[
                                styles.messageText,
                                isOwnMessage
                                    ? { color: theme.colors.text.inverse }
                                    : { color: theme.colors.text.primary },
                            ]}>
                                {item.content}
                            </Text>
                        </View>
                    );
                }}
            />
            <View style={[styles.inputRow, { backgroundColor: theme.colors.surface.light, borderColor: theme.colors.border.light }]}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: theme.colors.border.default,
                            color: theme.colors.text.primary,
                            backgroundColor: theme.colors.surface.light,
                        },
                    ]}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.colors.primary[500] }]} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        paddingVertical: 12,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        marginVertical: 4,
        borderRadius: 12,
    },
    ownBubble: {
        alignSelf: 'flex-end',
    },
    otherBubble: {
        alignSelf: 'flex-start',
    },
    username: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 3,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    inputRow: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 20 : 12,
        borderTopWidth: 1,
        alignItems: 'flex-end',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from '../config';
import { useTheme } from '../context/ThemeContext';
import ButtonComponent from '../components/button-style';

// real-time chat screen using socket.io for sending and receiving messages
export default function ChatScreen({ route }: any) {
    const { channelId, channelName, userId, token, role } = route.params;
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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

    // emits a message to the channel via socket.io
    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;
        socketRef.current.emit('sendMessage', {
            channelId,
            userId,
            content: input.trim(),
        });
        setInput('');
    };

    // opens the delete confirmation modal for admins on long press
    const handleLongPressMessage = (messageId: string) => {
        if (role !== 'admin') return;
        setMessageToDeleteId(messageId);
        setDeleteModalVisible(true);
    };

    // sends delete request for a message and removes it from the list
    const handleDeleteMessage = async () => {
        if (!messageToDeleteId || !token) {
            setDeleteModalVisible(false);
            setMessageToDeleteId(null);
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/messages/${messageToDeleteId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error('Failed to delete message:', errData);
                return;
            }

            setMessages(prev => prev.filter(message => message.id !== messageToDeleteId));
        } catch (err) {
            console.error('Failed to delete message:', err);
        } finally {
            setDeleteModalVisible(false);
            setMessageToDeleteId(null);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.surface.default }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.chatArea}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                    renderItem={({ item }) => {
                        const isOwnMessage = item.userId === userId;
                        const messageBubble = (
                            <View style={[
                                styles.messageBubble,
                                isOwnMessage
                                    ? [styles.ownBubble, { backgroundColor: theme.colors.secondary.dark }]
                                    : [styles.otherBubble, { backgroundColor: theme.colors.secondary.light }],
                            ]}>
                                {!isOwnMessage && (
                                    <Text style={[styles.username, { color: theme.colors.secondary.dark }]}>
                                        {item.username}
                                        {item.role === 'admin' && (
                                            <Text style={styles.adminTag}> (Admin)</Text>
                                        )}
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

                        return (
                            <TouchableOpacity
                                activeOpacity={role === 'admin' ? 0.8 : 1}
                                onLongPress={() => handleLongPressMessage(item.id)}
                                delayLongPress={250}
                                disabled={role !== 'admin'}
                            >
                                {messageBubble}
                            </TouchableOpacity>
                        );
                    }}
                />
                <BlurView intensity={60} tint="light" style={styles.inputBlur}>
                <View style={styles.inputRow}>
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
                        multiline={true}
                        blurOnSubmit={false}
                        returnKeyType="default"
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: theme.colors.secondary.dark },
                        ]}
                        onPress={sendMessage}
                        disabled={!input.trim()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
                </BlurView>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                    setDeleteModalVisible(false);
                    setMessageToDeleteId(null);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface.light }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
                            Delete this message?
                        </Text>
                        <View style={styles.modalButtons}>
                            <ButtonComponent
                                title="Cancel"
                                actionWhenPressed={() => {
                                    setDeleteModalVisible(false);
                                    setMessageToDeleteId(null);
                                }}
                                variant="secondary"
                                compact
                            />
                            <ButtonComponent
                                title="Delete"
                                actionWhenPressed={handleDeleteMessage}
                                variant="danger"
                                compact
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatArea: {
        flex: 1,
    },
    messageList: {
        paddingTop: 12,
        paddingBottom: 80,
        paddingHorizontal: 4,
    },
    messageBubble: {
        maxWidth: '78%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginHorizontal: 12,
        marginVertical: 3,
        borderRadius: 16,
    },
    ownBubble: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    username: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    adminTag: {
        fontSize: 11,
        fontWeight: '700',
        fontStyle: 'italic',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
    },
    inputBlur: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        alignItems: 'flex-end',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        borderRadius: 22,
        paddingHorizontal: 20,
        paddingVertical: 11,
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(53, 47, 41, 0.25)',
        paddingHorizontal: 24,
    },
    modalContent: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
});

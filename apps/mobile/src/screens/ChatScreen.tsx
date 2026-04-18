import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://10.136.246.64:3000';

export default function ChatScreen({ route }: any) {
    const { channelId, channelName, userId, token } = route.params;
    console.log('ChatScreen params:', { channelId, userId, token });
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
            .then(data => setMessages(data))
            .catch(err => console.error('Failed to load messages:', err));

        // Connect to Socket.io
        const socket = io(SERVER_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('joinChannel', channelId);
        });

        socket.on('newMessage', (message) => {
            setMessages(prev => [...prev, message]);
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
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                renderItem={({ item }) => (
                    <View style={styles.messageBubble}>
                        <Text style={styles.messageText}>{item.content}</Text>
                    </View>
                )}
            />
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    messageBubble: {
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 4,                                                                                                                                                            
        backgroundColor: '#e8f0fe',
        borderRadius: 8,                                                                                                                                                              
    },                                                                                                                                                                                
    messageText: { fontSize: 16 },
    inputRow: {                                                                                                                                                                       
        flexDirection: 'row',                                                                                                                                                       
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',                                                                                                                                                          
    },
    input: {                                                                                                                                                                          
        flex: 1,                                                                                                                                                                    
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,                                                                                                                                                             
        paddingHorizontal: 15,
        paddingVertical: 8,                                                                                                                                                           
        fontSize: 16,                                                                                                                                                               
    },
    sendButton: {                                                                                                                                                                     
        marginLeft: 10,
        backgroundColor: '#5895d3',                                                                                                                                                   
        borderRadius: 20,                                                                                                                                                           
        paddingHorizontal: 20,
        justifyContent: 'center',                                                                                                                                                     
    },
    sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },                                                                                                                    
});
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Grid } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000'); // Replace with your Flask server address

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        const handleNewMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        socket.on('message', handleNewMessage);

        return () => {
            socket.off('message', handleNewMessage);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim() !== '') {
            socket.emit('message', inputMessage);
            setInputMessage('');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Chat App
                    </Typography>
                    <List style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {messages.map((message, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={message} />
                            </ListItem>
                        ))}
                    </List>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
                            Send
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Chat;

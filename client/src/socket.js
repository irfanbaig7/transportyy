import { io } from 'socket.io-client'

let socket = null

// Single shared socket instance for the whole app (chat + call signaling).
// Connects through the same origin — Vite's dev proxy (see vite.config.js)
// forwards /socket.io to the Express server, so no separate URL/CORS config needed.
export function connectSocket(token) {
    if (socket && socket.connected) return socket
    if (socket) {
        socket.auth = { token }
        socket.connect()
        return socket
    }
    socket = io({
        path: '/socket.io',
        auth: { token },
        autoConnect: true,
        reconnection: true,
    })
    return socket
}

export function getSocket() {
    return socket
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}
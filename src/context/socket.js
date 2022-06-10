import socketio from "socket.io-client";

import { createContext } from "react";


const SOCKET_URL = "http://localhost:8000"; //Add URL of your webserver here

export const socket = socketio.connect(SOCKET_URL);
export const SocketContext = createContext();

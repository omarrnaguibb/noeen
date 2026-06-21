import { io } from "socket.io-client";

export const api_route =
  // "http://localhost:8080";
  "https://noen-ser.onrender.com";
export const socket = io(api_route, { autoConnect: true });

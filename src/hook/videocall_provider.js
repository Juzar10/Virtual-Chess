import { createContext, useEffect, useRef, useState } from "react";
import { socket } from "../context/socket";
import { useColor } from "./player_provider";
var Peer = require("simple-peer");

export const videoCallContext = createContext();

export default function VideoCallProvider({ children }) {
  const { gameidcontext } = useColor();

  const [incomingCall, setIncomingCall] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [calling, setCalling] = useState(false);

  //cop = callotherperson , calling = show your video and call other , connected , answer = otherperson is calling

  const [sstream, SetStream] = useState(null);

  const [peer1data, setpeer1data] = useState(null);

  const myv = useRef();
  const otherplayerv = useRef();

  useEffect(() => {
    socket.on("answercall", (data) => {

      setIncomingCall(true);
      setpeer1data(data);
    });
    socket.on("hangup", () => {
      setIncomingCall(false)
      setCallConnected(false)
      setCalling(false)
      if (myv.current.srcObject) {
        myv.current.srcObject.getTracks().forEach(function (track) {
          if (track.readyState === 'live' && track.kind === 'video') {
            track.stop();

          }
        });
      }
      SetStream(null)
    })
    return () => { };
  }, []);

  const ShowCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      SetStream(stream);
      myv.current.srcObject = stream;
    });
  };

  const answerToOtherPerson = () => {
    const peer2 = new Peer({
      initiator: false,
      trickle: false,
      stream: sstream,
    });

    peer2.on("signal", (data) => {
      socket.emit("answertocall", {
        answer: true,
        gameid: gameidcontext,
        peerdata: data,
      });
    });

    setCallConnected(true);
    peer2.on("stream", (stream) => {
      otherplayerv.current.srcObject = stream;
    });
    peer2.signal(peer1data);
  };

  const CallOtherPerson = () => {
    const peer1 = new Peer({
      initiator: true,
      trickle: false,
      stream: sstream,
    });

    peer1.on("signal", (data) => {
      socket.emit("callother", { gameid: gameidcontext, peerdata: data });
    });
    peer1.on("stream", (stream) => {

      otherplayerv.current.srcObject = stream;
    });
    setCalling(true);
    socket.on("replytocallrequest", (answer, peerdata) => {
      peer1.signal(peerdata);
      setCallConnected(true);
    });


  };

  const HangUp = () => {
    setIncomingCall(false)
    setCallConnected(false)
    setCalling(false)
    if (sstream) {
      sstream.getTracks().forEach(function (track) {
        if (track.readyState === 'live' && track.kind === 'video') {
          track.stop();

        }
      });
    }
    SetStream(null)

    socket.emit("hangup", { gameid: gameidcontext })
  }


  return (
    <videoCallContext.Provider
      value={{
        CallOtherPerson,
        answerToOtherPerson,
        myv,
        otherplayerv,
        sstream,
        calling,
        ShowCamera,
        incomingCall,
        callConnected,
        HangUp
      }}
    >
      {children}
    </videoCallContext.Provider>
  );
}

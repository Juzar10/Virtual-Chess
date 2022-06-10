import { useContext, useState } from "react";
import { useEffect } from "react";
import { videoCallContext } from "../hook/videocall_provider";
import "../index.css";

export const VideoPlayer = () => {
  const [calller, setCaller] = useState(false);

  const {
    CallOtherPerson,
    answerToOtherPerson,
    myv,
    otherplayerv,
    calling,
    sstream,
    incomingCall,
    ShowCamera,
    callConnected,
    HangUp,

  } = useContext(videoCallContext);

  // const callConnected = true;
  useEffect(() => {
    // const peer = new Peer({ initiator: true, trickle: false, stream });
    // console.log("peer", peer);
    // peer.on("signal", (data) => {
    //   console.log("data", data);
    // });
  }, []);

  const handleShowCamera = (iscaller) => {
    setCaller(iscaller);
    ShowCamera();
  };

  return (
    <div className="w-full">
      {sstream === null && (
        <div className="flex items-center justify-center h-screen">
          {!incomingCall && (
            <button
              className="px-3 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-800 w-60"
              onClick={() => handleShowCamera(true)}
            >
              Start Video Call{" "}
            </button>
          )}
          {incomingCall && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl "> Other Person is calling</p>
              <div>
                <div className="z-10 absolute ml-60 transform translate-y-2 translate-x-1">
                  <span className="flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-purple-600 bg-purple-100"></span>
                    <span className=" animate-ping absolute inline-flex rounded-full h-4 w-4 bg-purple-100"></span>
                  </span>
                </div>
                <button
                  className="px-3 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-800 w-60 m-3"
                  onClick={ShowCamera}
                >
                  Show Your Camera{" "}
                </button>
              </div>
              <p className="text-gray-400">
                you can first see your camera and then choose to answer the call
              </p>
            </div>
          )}
        </div>
      )}
      {sstream !== null && calller && (
        <div
          className={` ${!callConnected ? `h-screen ` : ``
            } flex flex-col justify-center items-center mt-4`}
        >
          <div
            id="temp"
            className={`  bg-green-500  rounded-lg ${!callConnected
                ? `w-5/6 h-2/3 flex justify-center `
                : `w-56 h-36 absolute z-10 transform translate-y-34 translate-x-72`
              } `}
          >
            {" "}
            <video clasName="w-full rounded-lg" ref={myv} autoPlay muted />
          </div>
          {!callConnected && (
            <div>
              <button
                className="px-3 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-800 w-60 m-3"
                onClick={CallOtherPerson}
              >
                Call Other Person
              </button>
              {calling && (
                <div>
                  <p className="text-gray-500">
                    Calling Other Person Please wait
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {sstream !== null && !calller && (
        <div
          className={` ${!callConnected ? `h-screen ` : ``
            } flex flex-col justify-center items-center mt-4`}
        >
          <div
            id="temp"
            className={` bg-green-500 rounded-lg ${!callConnected
                ? `w-5/6 h-2/3 flex justify-center `
                : `w-56 h-36 absolute z-10 transform translate-y-34 translate-x-72`
              } `}
          >
            <video ref={myv} autoPlay muted />
          </div>
          {!callConnected && (
            <div>
              <button
                className="px-3 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-800 w-60 m-3"
                onClick={answerToOtherPerson}
              >
                Connect To Other Person
              </button>
            </div>
          )}
        </div>
      )}
      {callConnected && (
        <div className="h-screen flex flex-col items-center mt-10">
          <div
            id="temp"
            className="w-5/6 h-2/3 mt-3 rounded-lg flex justify-center "
          >
            {" "}
            <video ref={otherplayerv} autoPlay muted />
          </div>
          <button class="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={HangUp}>End Call</button>
        </div>
      )}
    </div>
  );
};

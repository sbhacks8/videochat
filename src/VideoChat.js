import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";

const VideoChat = () => {
  const [username, setUsername] = useState("Adam");
  const [roomName, setRoomName] = useState("Adama's Living Room");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    let connectRoom = async () => {
      setConnecting(true);
      if (connecting) return
      const data = await fetch("/video/token", {
        method: "POST",
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      Video.connect(data.token, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
      }
 connectRoom()
  });

  let render;
  if (room) {
    render = (
      <Room roomName={roomName} room={room} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <div></div>
    );
  }
  return render;
};

export default VideoChat;

import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [roomNumber,setRoomNumber] = useState(1);
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            console.log(messageData);
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };
    const a = 1;
    useEffect(()=>{
        socket.emit("get_room_number", room);
        socket.on("receive_room", (data) => {
            setRoomNumber(data);
            console.log(data);
        });
    })
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            // console.log(messageList)
        });
        socket.on("receive_room_number", (data) => {
            setRoomNumber(data);
            console.log(data);
        });
        return () => {
            socket.off('receive_message');
            socket.on("receive_room_number");
        };
    }, []);
    //  console.log(socket);
    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>live chat ({roomNumber} online)</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div className='message' id={username === messageContent.author ? "other" : "you"} >
                                <div>
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>

            </div>
            <div className="chat-footer">
                <input type="text" 
                value={currentMessage}
                placeholder='Hey...' onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>

    )
}

export default Chat
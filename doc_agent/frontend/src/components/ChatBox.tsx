// component for the chat page that handles sending the messages to the server
import { FormEvent } from "react";
import { FaArrowUp } from "react-icons/fa";
import { GoPaperclip } from "react-icons/go";
import { PiMicrophoneFill } from "react-icons/pi";
import { FaRegPauseCircle } from "react-icons/fa";

// interface for this Chat Component
interface ChatboxI {
  onSendMessage: (message: string) => void;
  chatInput: string;
  setChatInput: (value: string) => void;
  isLoading: boolean;
}

export default function ChatBox({
  onSendMessage,
  chatInput,
  setChatInput,
  isLoading,
}: ChatboxI) {
  //function to handle posting the data to the database
  const handleSending = (e: FormEvent) => {
    e.preventDefault();

    if (!chatInput.trim() || isLoading) {
      return;
    }

    onSendMessage(chatInput.trim());
  };

  return (
    <div className="">
      <form onSubmit={handleSending}>
        <div className="w-[650px] h-[110px] bg-[#171717]  outline-[#474747] outline-solid outline-[0.7px] rounded-xl relative">
          <input
            type="text"
            placeholder="Let me know what you want to look into"
            className="w-full mt-4.5 ml-4 h-auto outline-none text-[#dbdbdbe4]"
            onChange={(e) => {
              // catch the input changes and store in state
              setChatInput(e.target.value);
            }}
            value={chatInput}
            disabled={isLoading}
            // make it required to send the data
            required
          />
          {/*bottom button for the input bar */}
          <div className="flex justify-center items-center">
            <button
              className="bg-[#95AA75] p-1.5 rounded-4xl outline-solid outline-[0.5px] outline-[#6D6D6D] text-[#303030] absolute right-3 bottom-3 hover: cursor-pointer"
              type="submit"
              disabled={isLoading || !chatInput.trim()}
            >
              {/*Replace the logo for the UP with an arrow*/}
              {isLoading ? (
                <FaRegPauseCircle size={20} />
              ) : (
                <FaArrowUp size={17} />
              )}
            </button>
            {/*styling for the bottom buttons */}
            <div className="flex w-15 scale-110 absolute bottom-3 left-3">
              <button
                className="p-[3px] ml-1 rounded-[3px] outline-solid outline-[0.5px] bg-[#171717] outline-[#474747] hover:bg-[#2a2a2a] cursor-pointer"
                type="button"
                disabled={isLoading}
              >
                <GoPaperclip />
              </button>
              <button
                className="p-[3px] ml-2 rounded-[3px] outline-solid bg-[#171717] outline-[0.5px] outline-[#474747] hover:bg-[#2a2a2a] cursor-pointer "
                type="button"
                disabled={isLoading}
              >
                <PiMicrophoneFill />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

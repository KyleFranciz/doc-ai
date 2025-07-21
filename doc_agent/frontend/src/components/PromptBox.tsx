// icons and components for the user to use in the input box
import React, { FormEvent } from "react";
import { FaArrowUp, FaRegPauseCircle } from "react-icons/fa";
import { GoPaperclip } from "react-icons/go";
import { PiMicrophoneFill } from "react-icons/pi";

// create an interface to load props into the component
interface PromptBoxI {
  // handles all the functions, states and bools that need to be passed in
  handleSubmit?: (e: FormEvent<Element>) => Promise<void>; // prop that allows function inside
  setMessage: React.Dispatch<React.SetStateAction<string>>; // allows the set state inside
  loading?: boolean; // allows the setState loading from the outside to enter
  value: string;
}

// ReUsable prompting section that allows the user to ask doc questions
export default function PromptBox(props: PromptBoxI) {
  return (
    <div className="pt-[10px]">
      <form onSubmit={props.handleSubmit}>
        <div className="w-[650px] h-[110px] bg-[#171717] outline-[#474747] outline-solid outline-[0.7px] mt-4 rounded-xl relative">
          <textarea
            placeholder="Let me know what you want to look into"
            className="w-[620px] max-h-[50px] appearance-none border-none resize-none mt-4.5 ml-4 outline-none text-[#dbdbdbe4]"
            onChange={(e) => {
              // catch the input changes and store in state
              props.setMessage(e.target.value);
            }}
            // make it required to send the data
            required
            // make the value the same as the state
            value={props.value}
          />
          {/*bottom button for the input bar */}
          <div className="flex justify-center items-center">
            <button
              className="bg-[#0F9E6A] p-1.5 rounded-4xl outline-solid outline-[1px] outline-[#6D6D6D ] text-[#303030] absolute right-3 bottom-3 hover: cursor-pointer"
              type="submit"
              disabled={props.loading}
            >
              {/*Replace the logo for the UP with an arrow*/}
              {props.loading ? (
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
              >
                <GoPaperclip />
              </button>
              <button
                className="p-[3px] ml-2 rounded-[3px] outline-solid bg-[#171717] outline-[0.5px] outline-[#474747] hover:bg-[#2a2a2a] cursor-pointer "
                type="button"
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

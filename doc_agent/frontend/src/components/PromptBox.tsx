// icons and components for the user to use in the input box
import { FormEvent } from "react";
import { FaArrowUp } from "react-icons/fa";
import { GoPaperclip } from "react-icons/go";
import { PiMicrophoneFill } from "react-icons/pi";

// create an interface to load props into the component
interface PromptBoxI {
  handleSubmit?: (e: FormEvent<Element>) => Promise<void>; // prop that allows function inside
  setMessage: React.Dispatch<React.SetStateAction<string>>; // allows the set state inside
  loading?: boolean; // allows the setState loading from the outside to enter
}

// ReUsable prompting section that allows the user to ask doc questions
export default function PromptBox(props: PromptBoxI) {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div className="w-[650px] h-[110px] bg-[#303030]  outline-[#6D6D6D] outline-solid outline-[0.7px] mt-4 rounded-xl relative">
          <input
            type="text"
            placeholder="Let me know what you want to look into"
            className="w-full mt-4.5 ml-4 h-auto outline-none text-[#ffffffe4]"
            onChange={(e) => {
              // catch the input changes and store in state
              props.setMessage(e.target.value);
            }}
            // make it required to send the data
            required
          />
          {/*bottom button for the input bar */}
          <div className="flex justify-center items-center">
            <button className="bg-[#95AA75] p-1.5 rounded-4xl outline-solid outline-[0.5px] outline-[#6D6D6D] text-[#303030] absolute right-3 bottom-3 hover: cursor-pointer">
              {/*Replace the logo for the UP with an arrow*/}
              <FaArrowUp size={17} />
            </button>
            {/*styling for the bottom buttons */}
            <div className="flex w-15 scale-110 absolute bottom-3 left-3">
              <button
                className="p-[3px] ml-1 rounded-[3px] outline-solid outline-[0.5px] outline-[#6D6D6D]"
                type="submit"
              >
                {props.loading ? <div>O</div> : <GoPaperclip />}
              </button>
              <button className="p-[3px] ml-2 rounded-[3px] outline-solid outline-[0.5px] outline-[#6D6D6D]">
                <PiMicrophoneFill />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import { FaArrowUp } from "react-icons/fa";

function PromptPage() {
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        {/*Greet the user*/}
        <div className=" justify-center items-center">
          <h1 className="heading">Welcome User</h1>
          <h3 className="flex justify-center mt-[-10px] mb-6 text-xl">
            What do you want to research today?
          </h3>
        </div>
        {/*This section is for the input section of the page*/}
        <div className="w-[650px] h-[110px] bg-[#303030]  outline-[#6D6D6D] outline-solid outline-[0.7px] mt-4 rounded-xl relative">
          <input
            type="text"
            placeholder="Let me know what you want to look into"
            className="w-full mt-4.5 ml-4 h-auto outline-none text-[#ffffffe4]"
          />
          {/*bottom button for the input bar */}
          <div className="flex justify-center items-center">
            <button className="bg-[#95AA75] p-1.5 rounded-4xl outline-solid outline-[0.5px] outline-[#6D6D6D] text-[#303030] absolute right-3 bottom-3 hover: cursor-pointer">
              {/*Replace the logo for the UP with an arrow*/}
              <FaArrowUp size={17} />
            </button>
            <div>
              <button>Paper clip</button>
              <button>Microphone</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PromptPage;

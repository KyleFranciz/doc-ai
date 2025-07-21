import "../main.css";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  // use navigate to help with the routing to the other pages
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        <h1 className="font-[instrument-serif] tracking-tight text-[80px] text-white">
          It's nice to meet you,
        </h1>
      </div>
      {/*NOTE: MIGHT MAKE A SECOND LINE TO THE MAIN PAGE*/}
      {/* <div className="flex justify-center items-center"> */}
      {/*   <h2 className="font-[instrument-serif] tracking-tight text-[80px] text-white"> */}
      {/*     my name is Doc */}
      {/*   </h2> */}
      {/* </div> */}
      <div className="flex items-center mt-[-22px] justify-center text-[22px] font-semibold">
        I'm <span className="font-bold italic mx-1.5 text-[#0F9E6A]">Doc</span>{" "}
        your favorite local ai agent here to help with all coding needs.
      </div>
      {/*Buttons for the user to sign up or sign in*/}
      <div className="flex items-center justify-center mt-2 text-[22px] font-semibold">
        <button
          onClick={() => {
            navigate("signup");
          }}
          className="bg-[#222222] text-white mr-3 px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-[#0F9E6A]/80 transition duration-300"
        >
          I'm new here
        </button>
        <button
          onClick={() => {
            navigate("login");
          }}
          className="bg-[#0F9E6A] text-white px-4 py-2 rounded-lg hover:cursor-pointer  hover:bg-[#0F9E6A]/80 transition duration-300"
        >
          I know you
        </button>
      </div>
    </div>
  );
}

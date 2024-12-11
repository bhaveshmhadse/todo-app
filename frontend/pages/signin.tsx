import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { UserInput } from "@bhavesh_mhadse/common-test";
import { BACKEND_URL } from "@/public/constants";

const SignIn = ({}) => {
  const router = useRouter();
  let [formData, setformData] = useState<UserInput>({ name: "", email: "", password: "" });

  const handleFormChange = (e: any) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    // alert(JSON.stringify(formData));
    console.log("formData is:", formData);

    try {
      let { data } = await axios.post(`${BACKEND_URL}api/v1/user/signin`, formData);
      if (data.jwt != undefined) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.jwt);
        router.push("/dashboard");
        // @ts-ignore
      }
    } catch (e) {
      alert("User already exists");
      setformData({ name: "", email: "", password: "" });
    }
  };

  useEffect((): any => {
    // @ts-ignore
    if (localStorage.getItem("isLoggedIn")?.length > 1) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="lg:w-2/3 w-5/6 h-auto flex flex-col p-2 rounded-lg shadow-lg border-gray-100 border-2">
        <div>
          <p className="lg:text-4xl text-center font-bold my-2">Sign In</p>
          <p className="text-center lg:text-lg text-sm">
            Don't have a account?{" "}
            <button className="underline" onClick={() => router.push("/signup")}>
              Signup
            </button>
          </p>
        </div>
        <div className="w-full flex mt-4 flex-col lg:text-lg text-sm">
          <label htmlFor="oyee" className="font-bold">
            Email
          </label>
          <input type="email" onChange={handleFormChange} value={formData.email} name="email" placeholder="Email" className="bg-slate-200 p-2 rounded-lg my-2 font-black outline-none text-gray-600 text-sm" />
        </div>
        <div className="w-full flex mt-4 flex-col lg:text-lg text-sm">
          <label htmlFor="oyee" className="font-bold">
            Password
          </label>
          <input type="password" onChange={handleFormChange} value={formData.password} name="password" placeholder="Password" className="bg-slate-200 p-2 rounded-lg my-2 font-black outline-none text-gray-600 text-sm" />
        </div>
        <div className="w-full flex mt-4 my-3 justify-end">
          <button onClick={(e) => handleSignUp(e)} className="lg:text-lg text-sm w-full bg-green-500 shadow-sm hover:shadow-none text-black px-6 py-2 rounded-xl font-black ">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

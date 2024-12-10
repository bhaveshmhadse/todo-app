import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/public/constants";
import { TodoInput } from "@bhavesh_mhadse/common-test";

const Dashboard = ({}) => {
  const router = useRouter();
  let [userName, setuserName] = useState("");
  let [showNewTodo, setshowNewTodo] = useState(false);
  let [todoData, settodoData] = useState<any>({ title: "", description: "", user_id: 0 });

  const handleFormChange = (e: any) => {
    // @ts-ignore
    settodoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddTodo = async () => {
    // alert(JSON.stringify(todoData));
    try {
      console.log('localStorage.getItem("token") is:', localStorage.getItem("token"));
      // axios.post()
      let { data } = await axios.post(`${BACKEND_URL}api/v1/todo`, todoData, { headers: { Authorization: localStorage.getItem("token"), "Content-Type": "application/json" } });
      console.log("data is:", data);
      if (data.data != undefined) {
        populateUserData();
        setshowNewTodo(false);
      }
    } catch (e) {}
  };

  let populateUserData = async () => {
    try {
      let { data } = await axios.get(`${BACKEND_URL}api/v1/user/getAll`, { headers: { Authorization: localStorage.getItem("token") } });
      if (data) {
        console.log("data.data is:", data.data);
        setuserName(data.data[0].firstName);
        setuserData(data.data[0].Todo);
      }
    } catch (error) {}
  };

  let [userData, setuserData] = useState([]);

  useEffect((): any => {
    // @ts-ignore
    if (localStorage.getItem("isLoggedIn") == undefined) {
      router.push("/signup");
    }
    populateUserData();
  }, []);
  return (
    <div className=" w-full flex flex-col">
      <div>
        <div className="font-bold lg:text-6xl text-sm text-center py-4 my-6 sticky ">
          Hello <span className="italic text-gray-700">{userName}</span>
        </div>
        <div className="w-full h-auto flex flex-col items-center justify-start">
          {userData.map((todo: TodoInput) => (
            <div className="lg:w-3/4 w-5/6 border-2 border-l-blue-700  my-2 rounded-xl h-auto flex" key={Math.random().toString()}>
              <div className="w-1/12 flex items-center justify-center">
                <input type="checkbox" name="isDone" id="" />
              </div>
              <div className="w-full flex items-center justify-end">
                <div className="w-full ">
                  <div className="font-bold lg:text-3xl text-sm py-2 text-gray-600">{todo.title}</div>
                  <div className="font-bold lg:text-lg text-xs  py2 pr-4 text-gray-500 text-justify">{todo.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setshowNewTodo((prev) => !prev)} className="border-blue-900 bg-blue-200 text-blue-800 fixed bottom-10 right-10 font-bold lg:text-3xl text-sm px-12 py-2 rounded-lg " style={{ borderWidth: "1px" }}>
        +
      </button>
      <button
        onClick={() => {
          localStorage.clear();
          router.back();
        }}
        className="border-red-900 bg-red-200 text-red-800 fixed bottom-10 left-10 font-bold lg:text-3xl text-sm px-12 py-2 rounded-lg "
        style={{ borderWidth: "1px" }}
      >
        Logout
      </button>
      {showNewTodo && (
        <div className="fixed bg-white w-full h-screen flex flex-col items-center justify-center">
          <div className="lg:w-3/4 w-5/6 border-2 shadow-md py-4 px-2 border-l-blue-700  my-2 rounded-xl h-auto flex border-transparent mb-4">
            <div className="w-1/12 flex items-center justify-center">
              <input type="checkbox" name="isDone" id="" />
            </div>
            <div className="w-full flex items-center justify-end">
              <div className="w-full ">
                <input onChange={handleFormChange} placeholder="Title" name="title" className="outline-none bg-slate-100 mt-2 rounded-lg p-2 w-full font-bold lg:text-3xl text-sm py-2 text-gray-600" />
                <input onChange={handleFormChange} placeholder="Description" name="description" className="h-auto outline-none bg-slate-100 mt-2 rounded-lg p-2 w-full font-bold lg:text-lg text-xs py2 pr-4 text-gray-500 text-justify" />
              </div>
            </div>
          </div>
          <div>
            <button onClick={() => setshowNewTodo(false)} className="border-red-900 mx-4 bg-red-200 text-red-800 font-bold lg:text-lg text-xs px-12 py-2 rounded-lg " style={{ borderWidth: "1px" }}>
              Close
            </button>
            <button onClick={() => handleAddTodo()} className="border-green-900 mx-4 bg-green-200 text-green-800 font-bold lg:text-lg text-xs px-12 py-2 rounded-lg " style={{ borderWidth: "1px" }}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

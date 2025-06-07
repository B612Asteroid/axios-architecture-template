import axios from "axios";
import instance from "@/apis/custom-instance";

async function testCall() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
  console.log(res.data);
}

export const fetchItems = async () => {
  return await instance.get("/items");
};

export const createItem = async (data: any) => {
  return await instance.post("/items", data);
};

testCall();

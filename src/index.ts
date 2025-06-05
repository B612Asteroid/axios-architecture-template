import axios from "axios";

async function testCall() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
  console.log(res.data);
}

testCall();

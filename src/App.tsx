import React, {useEffect} from 'react';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import toast from "react-hot-toast";

const resUrl = "https://elysia-container-runtime.lilhuy-server.uk/"
const updateApiUrl = "https://elysia-container-runtime-be.lilhuy-server.uk/update-code"

function App() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState('');
  const fetchResult = async () => {
    try {
      const res = await fetch(resUrl);
      const data = await res.text();
      setResult(data);
    } catch (e: any) {
      setResult(e.message);
    }
  }

  useEffect(() => {
    fetchResult();
  }, []);
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await fetch(updateApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({code})
      });
      const data = await res.json();
      console.log(data);
      await fetchResult();
      toast.success('Code updated successfully');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false)
    }
  }

  const [code, setCode] = React.useState(
    `import {Elysia} from "elysia";
import {cors} from "@elysiajs/cors";

const app = new Elysia()
app.use(cors());
app.get("/", () => {
  return "Hello, Elysia";
})
app.listen(process.env.PORT || 3000);
console.log("app is running at 3000")

`
  );
  return (
    <>
      <h1>Lilhuy k8s bun elysia runtime</h1>
      <div>
        <h3>Edit main.ts</h3>
        <div style={{border: '1px solid black'}}>
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update code'}
        </button>
        <div>
          <h3>Result on GET: <a href="https://elysia-container-runtime.lilhuy-server.uk/"
                                target='_blank'>https://elysia-container-runtime.lilhuy-server.uk/</a></h3>
          <div style={{border: '1px solid black'}}>
            <pre>
            {result}
          </pre>
          </div>

        </div>
      </div>
    </>
  );
}

export default App

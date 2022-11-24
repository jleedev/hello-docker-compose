const jsonRequest = (url, body) =>
  new Request(url, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: { "content-type": "application/json" },
  });
console.log(await fetch("http://server:3000/notes").then((r) => r.json()));
console.log(
  await fetch(
    jsonRequest("http://server:3000/notes/a", { body: "hello world" })
  ).then((r) => r.json())
);
console.log(await fetch("http://server:3000/notes").then((r) => r.json()));
console.log(await fetch("http://server:3000/notes/a").then((r) => r.json()));

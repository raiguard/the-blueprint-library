import React from "react";

const debugPosts = [
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  },
  {
    title: "Space Science",
    description: "My awesome space science setup"
  }
];

export default () => {
  return (
    <main className="home">
      <section className="search">
        <input placeholder="Search..." />
      </section>
      <section className="grid-view">
        {debugPosts.map((post, i) => (
          <div className="post-card" key={i}>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

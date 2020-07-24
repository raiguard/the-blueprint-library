create table users (
  id serial primary key,
  username varchar(30),
  password text,
  avatar text,
  is_admin boolean
);

create table posts (
  id serial primary key,
  author_id int references users(id),
  title varchar(80),
  img text,
  description varchar(3000),
  created_timestamp int,
  edited_timestamp int
);

create table comments (
  id serial primary key,
  post_id int references posts(id),
  author_id int references users(id),
  content varchar(500),
  created_timestamp int,
  edited_timestamp int
);

create table records (
  id serial primary key,
  type text,
  name text,
  description text,
  post_id int references posts(id),
  book_id int references records(id),
  string text
);
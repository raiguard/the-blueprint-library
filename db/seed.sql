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
  title varchar(200),
  img text,
  description varchar(1000),
  likes int,
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
  type varchar(5),
  name varchar(200),
  description varchar(500),
  icon_1 varchar(250),
  icon_2 varchar(250),
  icon_3 varchar(250),
  icon_4 varchar(250),
  grid_snap_x smallint,
  grid_snap_y smallint,
  absolute_snapping boolean,
  active_index smallint,
  index smallint,
  item varchar(200),
  post_id int references posts(id),
  book_id int references records(id),
  string text
);
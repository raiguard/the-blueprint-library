insert into users (
  username,
  password,
  avatar,
  is_admin
) values (
  ${username},
  ${password},
  ${avatar},
  false
)
returning id, username, avatar, is_admin;
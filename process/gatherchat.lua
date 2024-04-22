local ao = require("ao")
local json = require("json")
local utils = require(".utils")

-- Key: Address
Users = Users or {
  testUser1 = {
    processId = "id",
    created = 0,
    lastSeen = 0,
    name = "test",
    avatar = "a1204030b070a01", -- pixel art seed
    status = "Hello, World!",
    position = {
      x = 4,
      y = 5,
    },
    following = {
      "testUser2",
    },
  },
}

-- Key: Message ID
Posts = Posts or {
  testPost1 = {
    created = 0,
    author = "testUser1",
    type = "text", -- if "video"/"image" then "TextOrTxId" is a TxId
    textOrTxId = "",
  }
}

Handlers.add(
  "GetUsers",
  Handlers.utils.hasMatchingTag("Action", "GetUsers"),
  function(msg)
    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Users) })
  end
)

Handlers.add(
  "GetPosts",
  Handlers.utils.hasMatchingTag("Action", "GetPosts"),
  function(msg)
    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Posts) })
  end
)

Handlers.add(
  "Register",
  Handlers.utils.hasMatchingTag("Action", "Register"),
  function(msg)
    local address = msg.Owner;
    Users[address] = {}
    Users[address].processId = msg.From
    Users[address].created = msg.Timestamp
    Users[address].lastSeen = msg.Timestamp
    Users[address].following = {}

    local data = json.decode(msg.Data)
    Users[address].name = data.name
    Users[address].avatar = data.avatar
    Users[address].status = data.status
    Users[address].position = data.position

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Users[address]) })
  end
)


Handlers.add(
  "Update",
  Handlers.utils.hasMatchingTag("Action", "Update"),
  function(msg)
    local address = msg.Owner;
    Users[address].lastSeen = msg.Timestamp

    if string.len(msg.Data) > 0 then
      local data = json.decode(msg.Data)
      if data.name then Users[address].name = data.name end
      if data.avatar then Users[address].avatar = data.avatar end
      if data.status then Users[address].status = data.status end
      if data.position then
        Users[address].position = {
          x = data.position.x,
          y = data.position.y,
        }
      end
    end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Users[address]) })
  end
)

Handlers.add(
  "Follow",
  Handlers.utils.hasMatchingTag("Action", "Follow"),
  function(msg)
    local address = msg.Owner;
    -- Users[address].LastSeen = msg.Timestamp

    local data = json.decode(msg.Data)
    Users[address].following.add(data.Address)

    local Notification = {
      source = address,
      type = "Follow",
      address = msg.Owner,
    }

    local FollowedUserProcess = Users[data.address].processId
    if FollowedUserProcess then
      ao.send({ Target = FollowedUserProcess, Status = "OK", Action = "Notification", Data = json.encode(Notification) })
    end

    ao.send({ Target = msg.From, Status = "OK" })
  end
)

Handlers.add(
  "Unfollow",
  Handlers.utils.hasMatchingTag("Action", "Unfollow"),
  function(msg)
    local address = msg.Owner;
    -- Users[address].LastSeen = msg.Timestamp

    local data = json.decode(msg.Data)
    Users[address].following.remove(data.address)

    ao.send({ Target = msg.From, Status = "OK" })
  end
)

Handlers.add(
  "CreatePost",
  Handlers.utils.hasMatchingTag("Action", "CreatePost"),
  function(msg)
    local address = msg.Owner;
    -- Users[address].LastSeen = msg.Timestamp

    local data = json.decode(msg.Data)
    local Post = {
      created = msg.Timestamp,
      author = address,
      type = data.type,
      textOrTxId = data.textOrTxId,
    }
    Posts[msg.Id] = Post

    local Notification = {
      Source = address,
      Type = "Post",
      Post = Post,
    }

    -- Get all users following this user
    for _, user in pairs(Users) do
      if user.following.contains(address) then
        ao.send({
          Target = user.processId,
          Status = "OK",
          Action = "Notification",
          Data = json.encode(Notification),
        })
      end
    end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Post) })
  end
)

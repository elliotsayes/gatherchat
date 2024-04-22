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
    Users[address].name = data.Name
    Users[address].avatar = data.Avatar
    Users[address].status = data.Status
    Users[address].position = data.Position

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
      if data.Name then Users[address].name = data.Name end
      if data.Avatar then Users[address].avatar = data.Avatar end
      if data.Status then Users[address].status = data.Status end
      if data.Position then
        Users[address].position = {
          x = data.Position.x,
          y = data.Position.y,
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
      Source = address,
      Type = "Follow",
      Address = msg.Owner,
    }

    local FollowedUserProcess = Users[data.Address].ProcessId
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
    Users[address].following.remove(data.Address)

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
      Created = msg.Timestamp,
      Author = address,
      Type = data.Type,
      TextOrTxId = data.TextOrTxId,
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

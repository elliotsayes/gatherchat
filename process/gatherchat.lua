local ao = require("ao")
local json = require("json")
local utils = require(".utils")

-- Key: Address
local Users = Users or {
  testUser1 = {
    ProcessId = "id",
    Created = 0,
    LastSeen = 0,
    Name = "test",
    Avatar = "a1204030b070a01", -- pixel art seed
    Status = "Hello, World!",
    Position = {
      x = 4,
      y = 5,
    },
    Following = {
      "test2",
    },
  }
}

-- Key: Message ID
local Posts = Posts or {
  testPost1 = {
    Created = 0,
    Author = "testUser1",
    Type = "text", -- if "video"/"image" then "TextOrTxId" is a TxId
    TextOrTxId = "",
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
    Users[address].ProcessId = msg.From
    Users[address].Created = msg.Timestamp
    Users[address].LastSeen = msg.Timestamp
    Users[address].Following = {}

    local data = json.decode(msg.Data)
    Users[address].Name = data.Name
    Users[address].Avatar = data.Avatar
    Users[address].Status = data.Status
    Users[address].Position = data.Position

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Users[address]) })
  end
)


Handlers.add(
  "Update",
  Handlers.utils.hasMatchingTag("Action", "Update"),
  function(msg)
    local address = msg.Owner;
    Users[address].LastSeen = msg.Timestamp

    if string.len(msg.Data) > 0 then
      local data = json.decode(msg.Data)
      if data.Name then Users[address].Name = data.Name end
      if data.Avatar then Users[address].Avatar = data.Avatar end
      if data.Status then Users[address].Status = data.Status end
      if data.Position then
        Users[address].Position = {
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
    Users[address].Following.add(data.Address)

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
    Users[address].Following.remove(data.Address)

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
      if user.Following.contains(address) then
        ao.send({
          Target = user.ProcessId,
          Status = "OK",
          Action = "Notification",
          Data = json.encode(Notification),
        })
      end
    end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Post) })
  end
)

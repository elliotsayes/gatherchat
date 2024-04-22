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
    Following = {
      "test2",
    },
  }
}

-- Key: Message ID
local Posts = Posts or {
  testPost1 = {
    TimeStamp = 0,
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
      Users[address].Name = data.Name or Users[address].Name
      Users[address].Avatar = data.Avatar or Users[address].Avatar
      Users[address].Status = data.Status or Users[address].Status
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
      TimeStamp = msg.Timestamp,
      Author = address,
      Type = data.Type,
      TextOrTxId = data.TextOrTxId,
    }
    Posts[msg.Id] = Post

    -- Get all users following this user
    for _, user in pairs(Users) do
      if user.Following.contains(address) then
        ao.send({
          Target = user.ProcessId,
          Status = "OK",
          Action = "Notification",
          Data = json.encode(Post),
        })
      end
    end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Post) })
  end
)

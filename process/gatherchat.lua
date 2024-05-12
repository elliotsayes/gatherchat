local ao = require("ao")
local json = require("json")
local utils = require(".utils")

-- Key: Address
Users = Users or {
  LlamaSecretary = {
    processId = "id",
    created = 1713833416559,
    lastSeen = 1713833416559,
    name = "Llama Secretary",
    avatar = "a1204030b070a01", -- pixel art seed
    status = "Bureaucratizing cyberspace!",
    currentWorldId = "LlamaFED",
    following = {},
  },
}

-- Key: World ID
World = World or {
  LlamaFED = {
    created = 1713833416559,
    lastActivity = 1713833416559,
    name = "LlamaFED",
    description = "Home of the LLamaCoin Bureaucracy",
    worldSize = {
      w = 21,
      h = 12,
    },
    worldType = "decoratedRoom",
    worldTheme = "llamaFED",
    spawnPosition = {
      x = 6,
      y = 6,
    },
    playerPositions = {
      LlamaSecretary = {
        x = 3,
        y = 1,
      },
    }
  }
}

-- Key: Message ID
Posts = Posts or {
  WelcomePost = {
    created = 1713833416559,
    author = "Secretary of the Llama Board",
    worldId = "LlamaFED",
    type = "text",
    textOrTxId = "Welcome to LlamaFED! This room hosts the expert LlamaCoin Bureaucracy. " .. 
    "We are a group of Llamas working to make cyberspace a better place through sound, prudent, " ..
    "and very serious LlamaCoin monetary policy. You may petition the Llama council in this room to " .. 
    "print some new LlamaCoins for you, if you represent a worthy cause. Llama printer goes scREEEEEEEEE---",
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
  "GetWorldIndex",
  Handlers.utils.hasMatchingTag("Action", "GetWorldIndex"),
  function(msg)
    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(DefaultWorlds) })
  end
)

Handlers.add(
  "GetWorld",
  Handlers.utils.hasMatchingTag("Action", "GetWorld"),
  function(msg)
    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(World) })
  end
)

Handlers.add(
  "GetPosts",
  Handlers.utils.hasMatchingTag("Action", "GetPosts"),
  function(msg)
    local msgs = {}
    local dm = msg.DM or false

    for postId, post in pairs(Posts) do
      if dm then
        if dm == post.dm then
          msgs[postId] = post
        end
      else
        msgs[postId] = post
      end
    end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(msgs) })
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
    Users[address].currentWorldId = data.currentWorldId

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Users[address]) })
  end
)

Handlers.add(
  "UpdateUser",
  Handlers.utils.hasMatchingTag("Action", "UpdateUser"),
  function(msg)
    local address = msg.Owner;
    Users[address].lastSeen = msg.Timestamp

    if string.len(msg.Data) > 0 then
      local data = json.decode(msg.Data)
      if data.name then Users[address].name = data.name end
      if data.avatar then Users[address].avatar = data.avatar end
      if data.status then Users[address].status = data.status end
      if data.currentWorldId then Users[address].currentWorldId = data.currentWorldId end
    end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Users[address]) })
  end
)

Handlers.add(
  "UpdatePosition",
  Handlers.utils.hasMatchingTag("Action", "UpdatePosition"),
  function(msg)
    local address = msg.Owner;
    Users[address].lastSeen = msg.Timestamp

    if string.len(msg.Data) > 0 then
      local data = json.decode(msg.Data)
      if type(data) == "table" and data.worldId then
        if Worlds[data.worldId] then
          Users[address].currentWorldId = data.worldId
          Worlds[data.worldId].playerPositions[address] = {
            x = data.position.x,
            y = data.position.y,
          }
          ao.send({ Target = msg.From, Status = "OK" })
        else
          ao.send({ Target = msg.From, Status = "Error", Message = "World not found." })
        end
        return
      end
    end
    ao.send({ Target = msg.From, Status = "Error", Message = "Missing worldId." })
  end
)

Handlers.add(
  "Follow",
  Handlers.utils.hasMatchingTag("Action", "Follow"),
  function(msg)
    local address = msg.Owner;
    Users[address].lastSeen = msg.Timestamp

    local data = json.decode(msg.Data)
    Users[address].following[data.address] = true

    local Notification = {
      Source = address,
      Type = "Follow",
    }

    local followedUserProcess = Users[data.address].processId
    if followedUserProcess then
      ao.send({ Target = followedUserProcess, Status = "OK", Action = "Notification", Data = json.encode(Notification) })
    end

    ao.send({ Target = msg.From, Status = "OK" })
  end
)

Handlers.add(
  "Unfollow",
  Handlers.utils.hasMatchingTag("Action", "Unfollow"),
  function(msg)
    local address = msg.Owner;
    Users[address].lastSeen = msg.Timestamp

    local data = json.decode(msg.Data)
    Users[address].following[data.address] = nil

    ao.send({ Target = msg.From, Status = "OK" })
  end
)

Handlers.add(
  "CreatePost",
  Handlers.utils.hasMatchingTag("Action", "CreatePost"),
  function(msg)
    local address = msg.Owner;
    Users[address].lastSeen = msg.Timestamp

    local postId = msg.Id
    Posts[postId] = {}
    Posts[postId].created = msg.Timestamp
    Posts[postId].author = address
    Posts[postId].dm = msg.DM or false

    local data = json.decode(msg.Data)
    Posts[postId].type = data.type
    Posts[postId].textOrTxId = data.textOrTxId

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Posts[postId]) })
  end
)
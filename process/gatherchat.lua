local ao = require("ao")
local json = require("json")
local utils = require(".utils")

-- Key: Address
Users = Users or {
  testUser1 = {
    processId = "id",
    created = 1713833416559,
    lastSeen = 1713833416559,
    name = "Test User :)",
    avatar = "a1204030b070a01", -- pixel art seed
    status = "Hello, World!",
    currentWorldId = "WelcomeLobby",
    following = {
      -- testUser2 = true,
    },
  },
}

DefaultWorlds = {
  "WelcomeLobby",
  "ChillZone",
  "HolidayHangout",
}

-- Key: World ID
Worlds = Worlds or {
  WelcomeLobby = {
    created = 1713833416559,
    lastActivity = 1713833416559,
    name = "WelcomeLobby",
    description = "Welcome to the Lobby!",
    worldSize = {
      w = 21,
      h = 12,
    },
    worldType = "decoratedRoom",
    worldTheme = "room_default",
    spawnPosition = {
      x = 5,
      y = 4,
    },
    playerPositions = {
      testUser1 = {
        x = 4,
        y = 5,
      },
    },
  },
  ChillZone = {
    created = 1713833416559,
    lastActivity = 1713833416559,
    name = "ChillZone",
    description = "Take it easy ;)",
    worldSize = {
      w = 12,
      h = 14,
    },
    worldType = "clubbeach",
    worldTheme = "clubhouse1",
    spawnPosition = {
      x = 5,
      y = 4,
    },
    playerPositions = {}
  },
  HolidayHangout = {
    created = 1713833416559,
    lastActivity = 1713833416559,
    name = "HolidayHangout",
    description = "Sun, sand, and sea~",
    worldSize = {
      w = 18,
      h = 10,
    },
    worldType = "clubbeach",
    worldTheme = "beach1",
    spawnPosition = {
      x = 5,
      y = 4,
    },
    playerPositions = {}
  },
}

-- Key: Message ID
Posts = Posts or {
  testPost1 = {
    created = 1713833416559,
    author = "testUser1",
    worldId = "WelcomeLobby",
    type = "text", -- if "video" or "image" then "TextOrTxId" is a TxId
    textOrTxId = "Welcome to GatherChat!",
  },
  testPost2 = {
    created = 1713833416559,
    author = "testUser1",
    worldId = "HolidayHangout",
    type = "text", -- if "video" or "image" then "TextOrTxId" is a TxId
    textOrTxId = "I love being on holiday!",
  },
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
    if string.len(msg.Data) > 0 then
      local data = json.decode(msg.Data)
      if type(data) == "table" then
        local world = Worlds[data.worldId]
        if world then
          ao.send({ Target = msg.From, Status = "OK", Data = json.encode(world) })
        else
          ao.send({ Target = msg.From, Status = "Error", Message = "World not found." })
        end
        return
      end
    end
    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Worlds) })
  end
)

Handlers.add(
  "GetPosts",
  Handlers.utils.hasMatchingTag("Action", "GetPosts"),
  function(msg)
    if string.len(msg.Data) > 0 then
      local data = json.decode(msg.Data)
      if type(data) == "table" then
        local WorldPosts = {}
        for postId, post in pairs(Posts) do
          if post.worldId == data.worldId then
            WorldPosts[postId] = post
          end
        end
        ao.send({ Target = msg.From, Status = "OK", Data = json.encode(WorldPosts) })
        return
      end
    end
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

    local data = json.decode(msg.Data)
    Posts[postId].worldId = data.worldId
    Posts[postId].type = data.type
    Posts[postId].textOrTxId = data.textOrTxId

    -- local Notification = {
    --   Source = address,
    --   Type = "Post",
    --   Post = Posts[postId],
    -- }

    -- -- Notify all users following this user
    -- for follower, isFollowing in pairs(Users[address].following) do
    --   if isFollowing then
    --     local followerProcess = Users[follower].processId
    --     if followerProcess then
    --       ao.send({ Target = followerProcess, Status = "OK", Action = "Notification", Data = json.encode(Notification) })
    --     end
    --   end
    -- end

    ao.send({ Target = msg.From, Status = "OK", Data = json.encode(Posts[postId]) })
  end
)

---@class Result
---@field data any
---@field isSuccess boolean
---@field error string

local Await = Citizen.Await
local ResourceName = GetCurrentResourceName()

local Silk = {}
local ESilk = exports.silk

for _, method in pairs({
    "execute",
    "single",
    "insert",
    "update",
}) do
    Silk[method] = function(query, parameters)
        return Await(ESilk[method](nil, {
            query = query,
            parameters = parameters,
            invokingResource = ResourceName
        }))
    end
end

_ENV.Silk = Silk

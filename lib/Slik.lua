---@class Result
---@field data any
---@field error string
---@field IsSuccess boolean
---@field IsFailure boolean

local Promise = promise
local Await = Citizen.Await

---@param fn function
---@param query string
---@param parameters table
---@return Result
local function await(fn, query, parameters)
    local promise = Promise.new()

    fn(query, parameters, function(result, error)
        if error then
            return promise:reject(error)
        end

        promise:resolve(result)
    end)

    return Await(promise)
end

local Silk = {}
local ESilk = exports.silk

for _, method in pairs({
    "query",
    "single",
    "insert",
    "update",
}) do
    Silk[method] = setmetatable(
        {
            method = method,
            await = function(query, parameters)
                return await(ESilk[method], query, parameters)
            end
        },
        {
            __call = function(self, query, parameters, callback)
                return ESilk[self.method](nil, query, parameters, callback)
            end
        }
    )
end

_ENV.Silk = Silk

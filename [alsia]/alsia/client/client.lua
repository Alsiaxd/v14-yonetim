RegisterNetEvent("discordbot:Revive")
AddEventHandler("discordbot:Revive", function()
    -- Eğer anahtar fonksiyonun bir önemi yoksa, true ya da false kullanabilirsiniz.
    -- Aksi takdirde, buraya uygun bir anahtar veya başka bir değer ekleyin.
    TriggerEvent('hospital:client:Revive', false)
end)

RegisterNetEvent(GetCurrentResourceName()..':kill', function()
    SetEntityHealth(PlayerPedId(), 0)
end)

RegisterNetEvent(GetCurrentResourceName()..':teleport', function(x, y, z, withVehicle)
    x = tonumber(x)
    y = tonumber(y)
    z = tonumber(z)
    if (withVehicle) then
        SetPedCoordsKeepVehicle(PlayerPedId(), x, y, z)
    else
        SetEntityCoords(PlayerPedId(), x, y, z)
    end
end)

function serverOnly()
    print("[HATA] Tetiklenen olay yalnızca sunucuda çalıştırılabilir.")
end


 exports('isRolePresent', serverOnly)
 exports('getDiscordId', serverOnly)
 exports('getRoles', serverOnly)
 exports('getName', serverOnly)
 exports('log', serverOnly)

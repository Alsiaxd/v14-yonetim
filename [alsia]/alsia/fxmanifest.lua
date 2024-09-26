shared_script '@MasonGuard/ai_module_fg-obfuscated.lua'
shared_script '@MasonGuard/shared_fg-obfuscated.lua'

fx_version "cerulean"
games { "gta5" }

author "alsia"
description "Dev. By Alsia"
repository "https://github.com/alsiaxd/"
version "7.3.0"
license "CC-BY-NC-SA-4.0"
lua54 'yes'

server_script "alsia/alsia.js"
server_script "client/server.lua"
client_script "client/client.lua"

dependencies {
    '/server:4890', 
    'yarn',
}

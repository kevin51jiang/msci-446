# msci-446
wao


Detail for specific steam app ids:
- http://store.steampowered.com/api/appdetails?appids=%7BAPP_ID%7D
- Docs: https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI

Get all steam app ids: 
- http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json
- Docs: https://partner.steamgames.com/doc/webapi/ISteamApps

Itad docs:
- https://itad.docs.apiary.io/#reference/game/identifier/get-plain


Reasons for using each script (note: they're not named well/logically at all):
1. cleanRaw.js : given multiple array json files from itad trending games, concatenates the array and outputs it as one json array (itadApps)
1. GET https://api.isthereanydeal.com/v01/game/plain/list/?key=\<key>&shops=steam , gets apps.json, which relates steamIds to itadPlains
1. getRaw.js: given apps.json, itadApps, it creates an object that has itadRank, and steamId, and itadPlain. veeery inefficient (if expanding scope, definitely fix this)
1. steamExtendData.js: given apps.json, it looks on steam for details. Outputs it to working/steamData/\<steamId>.json
1. downloadItad.js: given apps.json, it looks on new itad page and downloads history from it in html files. Outputs to working/itadData/\<itadPlain>.html
1. itadExtendData.js: given all html files in working/itadData/, it extracts the sales data and outputs it to working/itadProcessed/\<itadPlain>.json
1. glue.js: given all previous data, combines to make data/processed/data.json. This has been zipped in the github repo because it is too large to fit. WE HAVE DATA NOW
1. cleanData1.r: is used to do some preliminary cleaning of data (dropping unused columns, one-hot encoding some fields, removing NA, doing some filtering), and outputs rNormalized.json. Made in exploratory.io.
1. cleanData2.py: is used to create timestamps from report/rNormalized.json into a tabular version we can use.



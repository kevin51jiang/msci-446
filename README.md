# msci-446-project


Detail for specific steam app ids:
- http://store.steampowered.com/api/appdetails?appids=%7BAPP_ID%7D
- Docs: https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI

Get all steam app ids: 
- http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json
- Docs: https://partner.steamgames.com/doc/webapi/ISteamApps

ITAD docs:
- https://itad.docs.apiary.io/#reference/game/identifier/get-plain



**Reasons for using each script:** 
1. GET https://api.isthereanydeal.com/v01/game/plain/list/?key=\<key>&shops=steam, gets apps.json, which relates steamIds to itadPlains
2. cleanRaw.js : given multiple array json files from ITAD trending games, concatenates the array and outputs it as one json array (itadApps)
4. getRaw.js: given apps.json, itadApps, it creates an object that has itadRank, and steamId, and itadPlain.
5. steamExtendData.js: given apps.json, it looks on steam for details. Outputs it to working/steamData/\<steamId>.json
6. downloadItad.js: given apps.json, it looks on new itad page and downloads history from it in html files. Outputs to working/itadData/\<itadPlain>.html
7. itadExtendData.js: given all html files in working/itadData/, it extracts the sales data and outputs it to working/itadProcessed/\<itadPlain>.json
8. glue.js: given all previous data, combines to make data/processed/data.json (This has been zipped in the github repo because it is too large to fit). 
9. cleanData1.r: is used to perform preliminary cleaning of data (dropping unused columns, one-hot encoding some fields, removing NA, doing some filtering), and outputs rNormalized.json. Made in exploratory.io.
10. cleanData2.py: is used to create timestamps from report/rNormalized.json into a tabular version we can use.



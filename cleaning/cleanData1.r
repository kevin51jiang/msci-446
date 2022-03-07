# Set libPaths.
.libPaths("C:\\Users\\Kevin\\.exploratory\\R\\4.1")

# Load required packages.
library(janitor)
library(lubridate)
library(hms)
library(tidyr)
library(stringr)
library(readr)
library(cpp11)
library(forcats)
library(RcppRoll)
library(dplyr)
library(tibble)
library(bit64)
library(zipangu)
library(exploratory)

# Steps to produce the output
exploratory::clean_data_frame(exploratory::toDataFrame(exploratory::convertFromJSON( "C:\\Users\\Kevin\\Documents\\gitstuff\\msci-446\\data\\processed\\data.json"))) %>%
  readr::type_convert() %>%
  mutate(steamId = as.character(steamId)) %>%
  filter(steam.type == "game") %>%
  mutate(steam.linux_requirements = list_n(steam.linux_requirements) > 0, steam.pc_requirements = list_n(steam.pc_requirements) > 0, steam.mac_requirements = list_n(steam.mac_requirements) > 0, steam.controller_support = steam.controller_support == "full", steam.controller_support = impute_na(steam.controller_support, type = "value", val = FALSE), steam.reviews = !is_empty(steam.reviews)) %>%
  select(-steam.type, -steam.header_image, -steam.website, -steam.legal_notice, -steam.demos, -steam.price_overview.currency, -steam.price_overview.initial, -steam.price_overview.final, -steam.price_overview.discount_percent, -steam.price_overview.initial_formatted, -steam.price_overview.final_formatted, -steam.metacritic.url, -steam.fullgame.appid, -steam.fullgame.name) %>%
  mutate(steam.dlc = list_n(steam.dlc)) %>%
  mutate(steam.drm_consolidated = case_when(str_detect(steam.drm_notice, regex("Denuvo", ignore_case=TRUE)) ~ "Denuvo" ,str_detect(steam.drm_notice, "EA") ~ "EA" ,str_detect(steam.drm_notice, "Ubisoft") ~ "Ubisoft" , TRUE ~ steam.drm_notice)) %>%
  mutate(steam.drm_consolidated = recode(steam.drm_consolidated, "DRM Free!" = "NA", "NONE<br>NO LIMIT machine activation limit" = "NA", "Reality Pump DLM V2<br>no machine activation limit" = "NA", "Reality Pump<br>no machine activation limit" = "NA", "SecuROM™" = "SecuROM", "SecuROM™<br>50 machine activation limit" = "SecuROM", "No 3rd Party DRM" = "NA", "Requires a Kalypso account" = "Kalypso", "Kalypso Launcher (Account registration optional)" = "Kalypso")) %>%
  select(-steam.drm_notice) %>%
  mutate(steam.supported_languages = str_remove_all(steam.supported_languages, "(<strong>|<\\/strong>|languages|with|full|audio|support|<br>|text|<b>|<\\/b>|\\[b\\]|\\[\\/b\\])", remove_extra_space = TRUE), steam.supported_languages = str_to_lower(steam.supported_languages), steam.supported_languages = str_remove_all(steam.supported_languages, "[[:punct:]]+")) %>%
  hoist(steam.genres, `steam.genres_id` = "id", .remove = FALSE) %>%
  mutate(steam.metacritic.score = steam.metacritic.score / max(steam.metacritic.score, na.rm=TRUE)) %>%
  one_hot(steam.drm_consolidated)
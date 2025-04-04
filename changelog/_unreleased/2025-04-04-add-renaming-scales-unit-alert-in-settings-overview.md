---
title: Add renaming scales unit banner in Settings overview
issue: #8226
author: Le Nguyen
author_email: nguyenquocdaile@gmail.com
author_github: @nguyenquocdaile
---
# Administration
* Added `sw_settings_content_card_view_unit_banner` block to show banner info for settings overview in `src/module/sw-settings/page/sw-settings-index/sw-settings-index.html.twig`
* Added `isUnitBahideSettingRenameBannernnerHidden` data property to hide the banner
* Added `getUserConfig` method to load user config
* Added `onCloseUnitBanner` method to close the banner
in `src/module/sw-settings/page/sw-settings-index/index.js`.

# streamdeck-smart-dsl
Streamdeck plugin for Smart Router DSL speed

## Purpose
This plugin is used to display the current speed of the Smart Router DSL.

# Setup Development Environment
- Refer to [Getting Started](https://docs.elgato.com/sdk/plugins/getting-started).
- Create a symlink to the plugin folder in the Streamdeck plugin folder.
- Run from windows CMD.
```cmd
mklink /D C:\Users\%USERNAME%\AppData\Roaming\Elgato\StreamDeck\Plugins\com.markuszeller.smartdsl.sdPlugin C:\Users\%USERNAME%\Documents\PhpstormProjects\streamdeck-smart-dsl\src\com.markuszeller.smartdsl.sdPlugin
```
- Clone the libs.
```cmd
git clone https://github.com/elgatosf/streamdeck-javascript-sdk src/com.markuszeller.smartdsl.sdPlugin/libs
```
- Drag the plugin from the Streamdeck to the button.

# Configuration of the plugin

- Enter Router IP.
- Enter Key (see below how to obtain).
- Select your preferred metrics (Mbit/s or MB/s). It can be switched by tapping the button.

# Obtain (encryption) key

Telekom encrypts the JSON with data about the connections. This project includes the decryption script wich is used with the router.

- Open your router page (i.e. http://192.168.2.1).
- Click on the status icon on the top bar.
- Open dev tools in browser (hit `F12`).
- Switch to the network tab.
- Reload with `F5`.
- Open search dialog with `CTRL`+`F`.
- Search for `keyArrayDefault`.
- Double click on the `var KeyArrayDefault = "xxx""` line.
- Copy the value in the quotes.
- Paste into plugin settings.

# Credits
- This is a private project and not affiliated with Deutsche Telekom AG.
- Telekom Logo @ https://commons.wikimedia.org/wiki/File:Deutsche_Telekom_2022.svg.

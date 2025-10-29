# RSS Check For Update

A Node.js utility that monitors RSS feeds for updates and automatically restarts game servers when new content is detected. Designed primarily for Steam game servers running in Docker containers on UnRAID.

## Overview

This tool checks RSS feeds (particularly Steam game RSS feeds) against locally stored data to detect new updates. When an update is found, it can automatically restart corresponding game servers to apply the updates.

## Features

- **RSS Feed Monitoring**: Parses RSS feeds and compares latest entries with cached data
- **Local Storage**: Maintains a cache of the latest RSS entries to detect changes
- **Docker Integration**: Automatically restarts Docker containers when updates are detected
- **UnRAID Support**: Built-in notifications and optimizations for UnRAID systems
- **Multi-Server Support**: Can manage multiple game servers simultaneously

## Supported Games

Currently configured for:

- **Satisfactory** (Steam ID: 526870)
- **ARK: Survival Evolved** (Steam ID: 346110)

## Installation

1. Clone the repository in to unraid user scripts directory:

    ```bash
    cd /boot/config/plugins/user.scripts/scripts
    git clone https://github.com/SoulOfNoob/RSSCheckForUpdate.git
    ```

2. Install dependencies:

    ```bash
    cd /boot/config/plugins/user.scripts/scripts/RSSCheckForUpdate/js
    npm install
    ```

3. Configure the script as needed (see Configuration section).

4. Set up Cron job or UnRAID user script to run the update script periodically.

## Usage

### Basic RSS Check

```bash
node js/app.js <RSS_URL> [CUSTOM_SUFFIX]
```

**Parameters:**

- `RSS_URL`: The RSS feed URL to monitor
- `CUSTOM_SUFFIX` (optional): A custom suffix for the cache file

**Example:**

```bash
node js/app.js "https://steamcommunity.com/games/526870/rss/" "satisfactory_server"
```

**Returns:**

- `true`: Update detected (RSS content changed)
- `false`: No update (RSS content unchanged)

### Automated Server Updates (UnRAID)

For automatic server management, setup this script using the user scripts plugin on UnRAID:

```bash
./UnRAID/UpdatePterodactylServersFromRSS.sh
```

This script will:

1. Check RSS feeds for configured games
2. Detect if updates are available
3. Restart corresponding Docker containers
4. Send UnRAID notifications (if running on UnRAID)

## Configuration

### Adding New Games

Edit the `server` array in `UnRAID/UpdatePterodactylServersFromRSS .sh`:

```bash
server=(
    'GameName;SteamGameID;ContainerID'
    'Satisfactory;526870;f869f8e6'
    'ARK;346110;f92600c9'
    'YourGame;123456;container_id'
)
```

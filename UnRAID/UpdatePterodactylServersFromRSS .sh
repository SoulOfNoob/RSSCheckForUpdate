#!/bin/bash

UNRAID_SCRIPT_LOCATION="/mnt/user/SSD/scripts/RSSCheckForUpdate"

# Name;GameID;ContainerID
server=(
    'Satisfactory;526870;bc5fe497'
    'ARK;346110;f92600c9'
)

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

UNRAID=false
NODE_SCRIPT_LOCATION="${PROJECT_DIR}/js/app.js"
if [ ! -f $NODE_SCRIPT_LOCATION ]; then
	NODE_SCRIPT_LOCATION="${UNRAID_SCRIPT_LOCATION}/js/app.js"
    if [ ! -f $NODE_SCRIPT_LOCATION ]; then
	    echo "RSS Script not found"
	    exit 1
	else
		UNRAID=true
	fi
fi

for server in ${server[@]}; do
	IFS=";" read -r -a arr <<< "${server}"
	NAME="${arr[0]}"
	GAME_ID="${arr[1]}"
	CONTAINER_ID="${arr[2]}"
	# echo "NAME: ${NAME}"
	# echo "GAME_ID: ${GAME_ID}"
	# echo "CONTAINER_ID: ${CONTAINER_ID}"

	RSS_URL="https://steamcommunity.com/games/${GAME_ID}/rss/"
	# echo "RSS_URL: ${RSS_URL}"

	UPDATE_NEEDED=`node $NODE_SCRIPT_LOCATION $RSS_URL $CONTAINER_ID`

	echo "${NAME} - UPDATE_NEEDED: ${UPDATE_NEEDED}"

    if [ "$UPDATE_NEEDED" = true ] ; then
	    echo "Restart ${NAME} Server with ID: ${CONTAINER_ID}"
	    if $UNRAID; then 
		    if docker restart $(docker ps | grep $CONTAINER_ID | awk '{print $1}'); then
				echo "Restarting.."
				if $UNRAID; then /usr/local/emhttp/webGui/scripts/notify -s "Restarting ${NAME} Server" -d "${CONTAINER_ID}" -e "UpdatePterodactylServersFromRSS" -i "normal"; fi
			else
				echo "Restart Failed.."
				if $UNRAID; then /usr/local/emhttp/webGui/scripts/notify -s "Restarting ${NAME} Server Failed" -d "" -e "UpdatePterodactylServersFromRSS" -i "alert"; fi
			fi
		fi
	fi
done

echo "Done!, you can close the window";
exit 0
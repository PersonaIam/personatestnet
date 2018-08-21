#!/bin/bash

#set -x

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
#                                                     #
#               Persona Commander Script              #
# 	          developed by tharude 	              #
#		a.k.a The Forging Penguin	      #
#         thanks ViperTKD for the helping hand        #
#                 19/01/2017 ARK Team                 #
#         and modified for Persona by                 #
#               SuperGrobi2.0                         #
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

LOC_SERVER="http://127.0.0.1"

persona_environment="testnet"

pause(){
        read -p "   	Press [Enter] key to continue..." fakeEnterKey
}

#PSQL Queries
query() {
    PUBKEY="$(psql -d persona_${persona_environment} -t -c 'SELECT ENCODE("publicKey",'"'"'hex'"'"') as "publicKey" FROM mem_accounts WHERE "address" = '"'"$ADDRESS"'"' ;' | xargs)"
    DNAME="$(psql -d persona_${persona_environment} -t -c 'SELECT username FROM mem_accounts WHERE "address" = '"'"$ADDRESS"'"' ;' | xargs)"
    PROD_BLOCKS="$(psql -d persona_${persona_environment} -t -c 'SELECT producedblocks FROM mem_accounts WHERE "address" = '"'"$ADDRESS"'"' ;' | xargs)"
    MISS_BLOCKS="$(psql -d persona_${persona_environment} -t -c 'SELECT missedblocks FROM mem_accounts WHERE "address" = '"'"$ADDRESS"'"' ;' | xargs)"
    #BALANCE="$(psql -d persona_${persona_environment} -t -c 'SELECT (balance/100000000.0) as balance FROM mem_accounts WHERE "address" = '"'"$ADDRESS"'"' ;' | sed -e 's/^[[:space:]]*//')"
    BALANCE="$(psql -d persona_${persona_environment} -t -c 'SELECT to_char(("balance"/100000000.0), '"'FM 999,999,999,990D00000000'"' ) as balance FROM mem_accounts WHERE "address" = '"'"$ADDRESS"'"' ;' | xargs)"
    HEIGHT="$(psql -d persona_${persona_environment} -t -c 'SELECT height FROM blocks ORDER BY HEIGHT DESC LIMIT 1;' | xargs)"
    RANK="$(psql -d persona_${persona_environment} -t -c 'WITH RANK AS (SELECT DISTINCT "publicKey", "vote", "round", row_number() over (order by "vote" desc nulls last) as "rownum" FROM mem_delegates where "round" = (select max("round") from mem_delegates) ORDER BY "vote" DESC) SELECT "rownum" FROM RANK WHERE "publicKey" = '"'03cfafb2ca8cf7ce70f848456b1950dc7901946f93908e4533aace997c242ced8a'"';' | xargs)"
}

function net_height {
    local heights=$(curl -s "$LOC_SERVER/api/peers" | jq -r '.peers[] | .height')
    
    highest=$(echo "${heights[*]}" | sort -nr | head -n1)
}

function proc_vars {
        node=`pgrep -a "node" | grep persona-node | awk '{print $1}'`
        if [ "$node" == "" ] ; then
                node=0
        fi

        # Is Postgres running
        pgres=`pgrep -a "postgres" | awk '{print $1}'`

        # Find if forever process manager is runing
        frvr=`pgrep -a "node" | grep forever | awk '{print $1}'`

        # Find the top level process of node
        #top_lvl=$(top_level_parent_pid $node)

        # Looking for ark-node installations and performing actions
        personadir=$(locate -b 'persona-node')

        # Getting the parent of the install path
        parent=`dirname $personadir 2>&1`
    	node_path="${HOME}/.nvm/versions/*/*/bin"
       
#
## Forever Process ID
#
#        {frvr}=`${node_path}/forever --plain list | grep $node | sed -nr 's/.*\[(.*)\].*/\1/p'`
#        # Node process work directory
#        nwd=`pwdx $node 2>/dev/null | awk '{print $2}'`
#
}


# Drop ARK DB
function drop_db {
        # check if it's running and start if not.
        if [ -z "$pgres" ]; then
                sudo service postgresql start
        fi
        echo -e "\n\t✔ Droping the persona database!"
        dropdb --if-exists persona_${persona_environment} 
}

function create_db {
        #check if PG is running here if not Start.
        if [ -z "$pgres" ]; then
                sudo service postgresql start
        fi
        echo -e "\n\t✔ Creating the persona database!"
         sudo -u postgres psql -c "update pg_database set encoding = 6, datcollate = 'en_US.UTF8', datctype = 'en_US.UTF8' where datname = 'template0';"
         sudo -u postgres psql -c "update pg_database set encoding = 6, datcollate = 'en_US.UTF8', datctype = 'en_US.UTF8' where datname = 'template1';"
         sudo -u postgres dropuser --if-exists $USER
         sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD 'password' CREATEDB;"

        createdb persona_${persona_environment}
}

function promptyn () {
    while true; do
        read -p "$1 " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo -e "\nPlease answer yes or no.\n";;
        esac
    done
}

# Check if program is installed
function node_check {
        # defaulting to 1
        return_=1
        # changing to 0 if not found
        type $1 >/dev/null 2>&1 || { return_=0; }
        # return value
        # echo "$return_"
}

function os_up {
    echo -e "Checking for system updates...\n"
    sudo apt-get update >&- 2>&-
    avail_upd=`/usr/lib/update-notifier/apt-check 2>&1 | cut -d ';' -f 1`
        if [ "$avail_upd" == 0 ]; then
                echo -e "There are no updates available\n"
                sleep 1
        else
	    if promptyn "There are $avail_upd updates available for your system. Would you like to install them now? [y/N]: "; then
            	echo -e "Updating the system...\n"

            	sudo apt-get upgrade -yqq
            	sudo apt-get dist-upgrade -yq
            
	    	echo -e "Do some cleanup..."

	    	sudo apt-get autoremove -yyq
            	sudo apt-get autoclean -yq
            
		echo -e "\nThe system was updated!"
            	echo -e "\nSystem restart is recommended!"
            
            else
            	echo -e "\nSystem update canceled. We strongly recommend that you update your operating system on a regular basis."
            fi
        fi
}

# Start Persona Node
start(){
        proc_vars
        if [ -e $personadir/app.js ]; then
                echo -e "\n\t✔ Persona Node installation found!"
                if [ "$node" != "" ] && [ "$node" != "0" ]; then
                        echo -e "\tA working instance of the Persona node was found with:"
                        echo -e "\tSystem PID: $node, Forever PID ${frvr}"
                        echo -e "\tand Work Directory: $personadir\n"
        	else
			echo -e "\n\tStarting Persona Node..."
			${node_path}/forever start --silent app.js --genesis genesisBlock.${persona_environment}.json --config config.${persona_environment}.json >&- 2>&-
			echo -e "\t✔ Persona Node was successfully started"
			sleep 1
			echo -e "\n\tPersona Node started with:"
			echo -e "\tSystem PID: $node, Forever PID $frvr"

			echo -e "\tand Work Directory: $personadir\n"
                fi
	else
        	echo -e "\n✘ No Persona Node installation is found\n"
    fi
}

# Rebuild the Persona Node
rebuild(){
        proc_vars
        killit
        drop_db
        create_db
        sudo -u postgres psql -q -c "UPDATE pg_database SET datallowconn = true WHERE datname = 'persona_${persona_environment}';"

        if ! curl -s http://5.135.75.78/${persona_environment}/latest-db --output ${personadir}/latest-db ; then 
                echo -e "X Failed to download the snapshot"
            else
                    echo -e  "\t✔ Succesfully downloaded the snapshot"
        fi
        
        sleep 5

        if ! gunzip -fcq  ${personadir}/latest-db >  ${personadir}/snapshot.dump; then
            echo -e "X Failed to unpack the shapshot"
        fi

        echo -e "\t✔ Restoring the snapshot"
        pg_restore -O -d persona_${persona_environment} ${personadir}/snapshot.dump 2>&- 

        echo  -e "\t Cleaning up the file system."
        rm -fr ${personadir}/latest-db ${personadir}/snapshot.dump

        echo -e "\t Tunning the database."
        sudo -u postgres psql -q -d persona_${persona_environment} -c 'CREATE INDEX IF NOT EXISTS "mem_accounts2delegates_dependentId" ON "mem_accounts2delegates" ("dependentId");'
        start

}


# Node Status
status(){
        proc_vars
        if [ -e $personadir/app.js ]; then
		echo -e "\n\tStatus Persona Node..."
                echo -e "\t✔ Persona Node installation found!"
                if [ "$node" != "" ] && [ "$node" != "0" ]; then
                        echo -e "\tPersona Node process is working with:"
                        echo -e "\tSystem PID: $node, Forever PID $frvr"
                        echo -e "\tand Work Directory: $personadir"
        		query
			echo -e "\tBlock height: $HEIGHT"
                        echo -e "\tPeer table: $net_height\t"
                else
                        echo -e "\t✘ No Persona Node process is running"
                fi
        else
                echo -e "\n\t✘ No Persona Node installation is found\n"
        fi
}



# Restart Node
restart(){
    proc_vars
	
    if [ "$node" != "" ] && [ "$node" != "0" ]; then
        echo -e "\tInstance of Persona Node found with:"
        echo -e "\tSystem PID: $node, Forever PID ${frvr}"
        echo -e "\tDirectory: $personadir\n"
        ${node_path}/forever restart -s ${frvr} >&- 2>&-
        echo -e "\t✔ Persona Node was successfully restarted\n"
    else
        echo -e "\n\t✘ Persona Node process is not running\n"
    fi
}


# Stop Node
killit(){
        proc_vars
        if [ -e $personadir/app.js ]; then
		echo -e "\n\tKillin Persona Node..."
                echo -e "\t✔ Persona Node installation found!"
                if [ "$node" != "" ] && [ "$node" != "0" ]; then
			echo -e "\tA working instance of Pesona Node was found with:"
			echo -e "\tSystem PID: $node, Forever PID ${frvr}"
			echo -e "\tand Work Directory: $personadir\n"
			echo -e "\n\tStopping Pesona Node..."

			${node_path}/forever stop $node >&- 2>&-
			echo -e "\t✔ Persona Node was successfully stopped"
                else
            		echo -e "\t✘ No Persona Node process is running"
                fi
        else
                echo -e "\t✘ No Persona Node installation is found"
        fi
}


case $1 in
    "reload")
      killit
      sleep 2
      start
      ;;
    "status")
      status
    ;;
    "start")
      start
    ;;
    "stop")
      killit
    ;;
    "clean_db")
      killit
      drop_db
      create_db
    ;;
    "os_update")
      os_up
      ;;
    "rebuild")
      rebuild
    ;;
    *)
    echo 'Available options: reload (stop/start), start, stop, os_update, clean_db, rebuild'
    echo "Usage: ${0}"
    exit 1
    ;;
esac
exit 0

function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}

function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}

PROJECTHOME=$(pwd)
sysOS=$(uname -s)

if [[ $sysOS == "Linux" ]]; then

    release_name=$(lsb_release -i --short)
    release_num=$(lsb_release -r --short)

    echo "System: ${release_name} ${release_num}"

    if [ $release_name == "Ubuntu" ]; then

        if [ $release_num == 18.04 ] || [ $release_num == 20.04 ]; then

            # for basic tools
            sudo apt-get update
            # sudo apt-get upgrade -y
            sudo apt-get install build-essential libtinfo-dev libtinfo5 wget curl git cmake python3-pip libgraphviz-dev graphviz -y
            sudo pip3 install pygraphviz
            curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
            sudo apt install nodejs
            sudo npm install -g npm

            # for svf build
            npm i svf-lib --prefix ${HOME}
            cd ~
            git clone https://github.com/SVF-tools/SVF-example.git
            cd ~/SVF-example
            source ./env.sh
            cmake .
            make

            highlight "[BUILD BACKEND DONE.]"

        else
            errorshow "CANNOT SUPPORT YOU SYSTEM. SUPPORT UBUNTU 18.04 or 20.04."
        fi
    else
        errorshow "CANNOT SUPPORT YOU SYSTEM. SUPPORT UBUNTU 18.04 or 20.04."
    fi
else
    errorshow "CANNOT SUPPORT YOU SYSTEM. SUPPORT UBUNTU 18.04 or 20.04."
fi
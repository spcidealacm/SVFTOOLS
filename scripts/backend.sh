function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}
function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}

cd ~/SVF-example
source ./env.sh
cmake .
make

highlight "[BUILD BACKEND DONE.]"

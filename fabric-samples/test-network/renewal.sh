#!/bin/bash

while [[ true ]]; do

    source ./organizations/fabric-ca/reEnroll.sh

    rm ${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem
    docker restart ca_orderer
    sleep 10
    createOrderer

    docker restart $(docker ps -q)

    sleep 30
done
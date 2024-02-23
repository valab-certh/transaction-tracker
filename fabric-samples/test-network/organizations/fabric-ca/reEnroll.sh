#!/bin/bash

function createOrderer() {
  infoln "enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/orderer.iti.gr

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/orderer.iti.gr
  

  set -x
  fabric-ca-client reenroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem" --csr.keyrequest.reusekey --enrollment.profile tls
  { set +x; } 2>/dev/null

  infoln "Generating the orderer 0 msp"
  set -x
  fabric-ca-client enroll -u https://orderer0:orderer0pw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/msp" --csr.hosts orderer0.orderer.iti.gr --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem" --csr.keyrequest.reusekey --enrollment.profile tls
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/msp/config.yaml"

  infoln "Generating the orderer 1 msp"
  set -x
  fabric-ca-client reenroll -u https://orderer1:orderer1pw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/msp" --csr.hosts orderer1.orderer.iti.gr --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem" --csr.keyrequest.reusekey --enrollment.profile tls
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/msp/config.yaml"

  infoln "Generating the orderer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer0:orderer0pw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls"  --csr.hosts orderer0.orderer.iti.gr --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem" --csr.keyrequest.reusekey --enrollment.profile tls
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/server.key"

  mkdir -p "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/msp/tlscacerts/tlsca.orderer.iti.gr-cert.pem"

  mkdir -p "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer0.orderer.iti.gr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/tlscacerts/tlsca.orderer.iti.gr-cert.pem"

  infoln "Generating the orderer1-tls certificates"
  set -x
  fabric-ca-client reenroll -u https://orderer1:orderer1pw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls"  --csr.hosts orderer1.orderer.iti.gr --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem" --csr.keyrequest.reusekey --enrollment.profile tls
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/server.key"

  mkdir -p "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/msp/tlscacerts/tlsca.orderer.iti.gr-cert.pem"

  mkdir -p "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/orderers/orderer1.orderer.iti.gr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/tlscacerts/tlsca.orderer.iti.gr-cert.pem"


  infoln "Generating the admin msp"
  set -x
  fabric-ca-client reenroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/users/Admin@orderer.iti.gr/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/Orderer/tls-cert.pem" --csr.keyrequest.reusekey --enrollment.profile tls
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/orderer.iti.gr/users/Admin@orderer.iti.gr/msp/config.yaml"
}
